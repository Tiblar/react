// @flow

import React, {useEffect, useRef, useState} from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import axios from "axios";
import {toast} from "react-toastify";
import {Link} from "react-router-dom";
import striptags from "striptags";
import {connect} from "react-redux";
import {isMobile} from "is-mobile";
import Select from 'react-select'
import makeAnimated from 'react-select/animated';

import formStyles from "../../../../../../css/form.css";
import layoutStyles, {
    m1
} from "../../../../../../css/layout.css";
import postModalStyles from "../../../../../../css/layout/social/post-modal.css";
import postStyles from "../../../../../../css/components/post.css";
import {scrollbarHide} from "../../../../../../css/components/scroll.css";
import actionStyles from "../../../../../../css/components/action-menu.css";
import mobileOptionsStyles from "../../../../../../css/components/mobile-options.css";
import modalStyles from "../../../../../../css/components/modal.css";

import GearIcon from "../../../../../../assets/svg/icons/gear.svg";
import CheckIcon from "../../../../../../assets/svg/icons/check.svg";
import InfoIcon from "../../../../../../assets/svg/icons/info.svg";
import DotsLoading from "../../../../../../assets/loading/dots.svg";

import TypeSelector from "./TypeSelector";
import DropArea from "./DropArea";
import DropAreaSmall from "./DropAreaSmall";
import MediaWrapper from "./media/MediaWrapper";
import Poll from "./media/poll/Poll";
import Magnet from "./media/magnet/magnet";
import ReblogPost from "../../social/post/ReblogPost";

import Upgrade from "../../../../pages/settings/Upgrade";
import Container from "../../settings/Container";
import Footer from "./modal/Footer";
import NsfwCheckbox from "./modal/NsfwCheckbox";

import {
    API_URL,
    BODY_LENGTH,
    MAX_TAG_LENGTH,
    MAX_TAGS, POST_IMAGE_EXTENSIONS,
    POST_MAGNET,
    POST_POLL, POST_VIDEO,
    TITLE_LENGTH
} from "../../../../../../util/constants";

import {smartSubstr} from "../../../../../../util/smartSubstr";
import hasHitMaxFiles from "../../../../../../util/hasHitMaxFiles";

import {UPDATE_BOOSTED, UPDATE_LARGE_FILES, useManageActions, useManageDispatch, useManageState} from "./context";
import {CONTAINER, LAYER, useLayerDispatch} from "../../../layer/context";

import outsideClick from "../../../../../../util/components/outsideClick";
import {validateMagnet} from "../../../../../../util/magnet";
import fetchCaptcha from "../../../../../../util/captcha";
import ContentLoader from "../../../../../../util/components/ContentLoader";
import {makeIsBoosted} from "../../../../../../reducers/auth/selectors";
import switchStyles from "../../../../../../css/components/switch.css";
import VideoFooter from "./modal/VideoFooter";

const animatedComponents = makeAnimated();

const PostModal = (props) => {
    const postRef = useRef();
    const optionsRef = useRef();
    const _isMounted = useRef(true);
    const securityCodeRef = useRef();
    const thumbnailRef = useRef();

    const {poll, magnet, files, largeFiles, largeFileStatus, largeFilePart, largeFileTotal, type, shake, sizeError, error} = useManageState();

    const dispatchLayer = useLayerDispatch();
    const dispatchManage = useManageDispatch();

    const {uploadLargeFile} = useManageActions();

    let [manager, setManager] = useState({
        submitting: false,
        part: 1,
        categories: [],
        selectedCategories: [],
        randomThumbnail: false,
        thumbnailBlob: null,
        tags: {
            list: [],
            input: "",
        },
        drop: {
            modalWidth: 0,
            drag: false,
        },
        title: "",
        body: {
            html: "",
            length: 0,
        },
        nsfw: false,
        reblogPost: null,
        reblogError: false,
        showOptions: false,
        private: false,
        followersOnly: false,
        error: null,
        showCaptcha: false,
        captchaURL: null,
        captchaId: null,
        captchaLoading: true,
        securityCode: "",
    });

    useEffect(() => {
        return () => {
            _isMounted.current = false
        }
    }, []);

    useEffect(() => {
        loadCaptcha();
    }, [])

    useEffect(() => {
        setManager(manager => ({
            ...manager,
            drop: {
                ...manager.drop,
                modalWidth: postRef.current.clientWidth/2,
            }
        }));
    }, [postRef]);

    useEffect(() => {
        if(props.reblogPost !== null){
            const config = {
                headers: {
                    "Content-Type": "application/json"
                }
            };

            axios.get(API_URL + '/post/' + props.reblogPost, config)
                .then(function (res) {
                    let posts = res.data.data.posts;
                    if(posts !== undefined && posts.length > 0 && posts[0].poll === null){
                        setManager(manager => ({
                            ...manager,
                            reblogPost: posts[0],
                        }));
                    }
                })
                .catch(function (err) {
                    setManager(manager => ({
                        ...manager,
                        reblogError: true
                    }));
                });
        }
    }, [props.reblogPost]);

    useEffect(() => {
        dispatchManage({ type: UPDATE_BOOSTED, payload: props.isBoosted });
    }, [props.isBoosted]);

    useEffect(() => {
        loadCategories();
    }, []);

    function loadCategories() {
        const config = {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        };

        axios.get(API_URL + '/video/categories', config)
            .then(function (res) {
                if(res.data.data && res.data.data.categories){
                    setManager(manager => ({
                        ...manager,
                        categories: res.data.data.categories,
                    }))
                }
            }).catch();
    }

    function handleTagSubmit(e) {
        if (e.key === "Enter") {
            e.preventDefault();

            let tag = manager.tags.input;

            let tags = tag.split(/,| |#/)

            let {list} = manager.tags;

            tags.forEach(tag => {
                tag = tag.replace(/\s/g, '');

                if(tag.length > 1 && tag.length > 1){
                    list = list.concat(tag);
                }

                list = [...new Set(list)];
            })

            setManager(manager => ({
                ...manager,
                tags: {
                    list: list,
                    input: ""
                }
            }));
        }
    }

    function handleTagInput(e) {
        let value = e.target.value;

        setManager(manager => ({
            ...manager,
            tags: {
                ...manager.tags,
                input: value,
            }
        }));
    }

    function removeTag(removeTag) {
        let {list} = manager.tags;

        if(manager.submitting){
            return;
        }

        let newList = list.filter(tag => (tag !== removeTag));

        setManager(manager => ({
            ...manager,
            tags: {
                ...manager.tags,
                list: newList
            }
        }));
    }

    let tags = manager.tags.list.map(tag => (
        <div key={tag} className={postStyles.tag} onClick={() => {removeTag( tag )}}>
            <label>#{tag}</label>
        </div>
    ));

    function handleTitleChange(e) {
        let value = e.target.value;
        setManager(manager => ({
            ...manager,
            title: value,
        }));
    }

    function handleBodyChange(val) {
        if(manager.submitting){
            setManager(manager => ({
                ...manager,
                body: {
                    ...manager.body,
                    html: smartSubstr(manager.body.html, BODY_LENGTH),
                    length: smartSubstr(val).length,
                }
            }));
            return;
        }

        if(manager.body.length >= BODY_LENGTH && !(smartSubstr(val, BODY_LENGTH).length < manager.body.length)){
            setManager(manager => ({
                ...manager,
                body: {
                    ...manager.body,
                    html: smartSubstr(manager.body.html, BODY_LENGTH),
                    length: smartSubstr(val).length,
                }
            }));

            return;
        }

        setManager(manager => ({
            ...manager,
            body: {
                ...manager.body,
                html: smartSubstr(val, BODY_LENGTH),
                length: smartSubstr(val).length,
            },
        }));
    }

    function handleNsfw(nsfw) {
        setManager(manager => ({
            ...manager,
            nsfw: nsfw,
        }))
    }

    async function handleSubmit() {
        if(manager.submitting || (!manager.body.length && !files.length &&
            (!poll.question.length && !poll.options[1].length && !poll.options[2].length) &&
            (!validateMagnet(magnet)))
        ){
            return;
        }

        setManager(manager => ({ ...manager, submitting: true }));

        const config = {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        };

        const data = new FormData();

        if(manager.thumbnailBlob){
            let thumbnailFile = manager.thumbnailBlob;
            if(!thumbnailFile.name || typeof thumbnailFile.name !== 'string'){
                thumbnailFile = new File([manager.thumbnailBlob], "thumbnail.png", {
                    type: "image/png",
                });
            }

            data.append('thumbnail', thumbnailFile);
        }

        if(manager.title.length > 0 && type !== POST_POLL){
            data.append('title', manager.title);
        }

        if(manager.body.length > 0 && type !== POST_POLL){
            data.append('body', manager.body.html);
        }

        if(manager.securityCode.length > 0){
            data.append('security_id', manager.captchaId);
            data.append('security_code', manager.securityCode);
        }

        if(type === POST_POLL){
            data.append('poll_question', poll.question);

            Object.values(poll.options).forEach(function(option) {
                if(option.replace(/\s+/g, '').length > 0){
                    data.append('poll_options[]', option);
                }
            });
        }

        if(type === POST_MAGNET){
            data.append('magnet', magnet);
        }

        for(let file of files){
            if(file.isLargeFile){
                await uploadLargeFile(file);
                continue;
            }

            if(file.rotatedFile){
                data.append('files[]', file.rotatedFile);
            }else{
                data.append('files[]', file.file);
            }

            data.append('rows[]', file.row.row);
        }

        largeFiles.forEach(file => {
            data.append('files[]', JSON.stringify({
                file_id: file.file_id,
                row: file.file.row.row,
                col: file.file.row.pos,
            }));
        });

        manager.selectedCategories.forEach(cat => {
            data.append('category[]', cat.value);
        })

        manager.tags.list.forEach(tag => {
            data.append('tags[]', tag);
        });

        data.append('nsfw', manager.nsfw);
        data.append('private', manager.private);
        data.append('followers_only', manager.followersOnly);

        if(props.reblogPost !== null){
            data.append('reblog', props.reblogPost);
        }

        axios
            .post(API_URL + "/post", data, config)
            .then(res => {
                const Notification = () => (
                    <div>
                        Post made! <Link to={`/post/${res.data.data.post.id}`}>Click to view</Link>
                    </div>
                );

                props.closeModal();

                toast(<Notification />, {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            })
            .catch(err => {
                dispatchManage({ type: UPDATE_LARGE_FILES, payload: [] })

                if(err.response && err.response.data.errors && err.response.data.errors.content){
                    setManager(manager => ({ ...manager, error: "CONTENT", submitting: false, showCaptcha: false }));
                    return;
                }

                if(err.response && err.response.data.errors && err.response.data.errors.captcha){
                    setManager(manager => ({ ...manager, error: "WRONG_SECURITY_CODE", submitting: false, showCaptcha: true }));
                    loadCaptcha();
                    return;
                }

                if(err.response && err.response.data.errors && err.response.data.errors.storage){
                    setManager(manager => ({ ...manager, error: "STORAGE", submitting: false, showCaptcha: false }));
                    return;
                }

                if(!err.response || err.response.status >= 300){
                    const Notification = () => (
                        <div>
                            There was an error!
                        </div>
                    );

                    toast.error(<Notification />, {
                        position: "bottom-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }

                setManager(manager => ({ ...manager, submitting: false }));
            });
    }

    function postButtonDisabled() {
        return (
            type !== POST_POLL && type !== POST_MAGNET && (files.length === 0 && striptags(manager.body.html).replace(/\s+/g, '').length === 0)
            ||
            type === POST_POLL && (
                poll.question.replace(/\s+/g, '').length === 0 ||
                poll.options[1].replace(/\s+/g, '').length === 0 ||
                poll.options[2].replace(/\s+/g, '').length === 0
            )
            ||
            type === POST_MAGNET && (magnet.replace(/\s+/g, '').length === 0 || !validateMagnet(magnet))
        )
    }

    function postVideoButtonDisabled() {
        return files.length === 0 || ((manager.title.length === 0 || manager.selectedCategories.length === 0) && props.postType === POST_VIDEO);
    }

    function nextVideoButtonDisabled() {
        return files.length === 0 || ((manager.title.length === 0 || (manager.thumbnailBlob === null && !manager.randomThumbnail)) && props.postType === POST_VIDEO)
    }

    function handleSecurityCode(e) {
        let value = e.target.value;

        setManager(manager => ({
            ...manager,
            securityCode: value.toLowerCase()
        }))
    }

    function handleCaptchaBack() {
        setManager(manager => ({
            ...manager,
            showCaptcha: false
        }))
    }

    function handleCaptchaNext() {
        setManager(manager => ({
            ...manager,
            showCaptcha: true
        }))
    }

    function checkEnter(e) {
        if (e.key === "Enter") {
            handleSubmit();
        }
    }

    function loadCaptcha() {
        fetchCaptcha().then(data => {
            if(_isMounted.current){
                setManager(manager => ({
                    ...manager,
                    captchaURL: data.captcha,
                    captchaId: data.id,
                }))
            }
        });
    }

    function handleUpgrade() {
        dispatchLayer({ type: LAYER, payload: <Upgrade /> });
        dispatchLayer({ type: CONTAINER, payload: <Container /> });
    }

    function handlePart(part) {
        setManager(manager => ({
            ...manager,
            part: part,
        }))
    }

    outsideClick(optionsRef, () => {
        if(manager.showOptions){
            setManager(manager => ({
                ...manager,
                showOptions: false,
            }));
        }
    })

    function handleCategoryChange(cat) {
        setManager(manager => ({
            ...manager,
            selectedCategories: cat,
        }))
    }

    const CaptchaPlaceholder = () => (
        <ContentLoader
            width="100%"
            height="135"
            viewBox="0 0 100 135"
            preserveAspectRatio="none"
        >
            <rect x="0" y="0" width="100%" height="135" />
        </ContentLoader>
    );

    const categoriesStyles = {
        menuList: (styles) => ({
            ...styles,
            background: "var(--background-input)",
            borderRadius: "0.5rem",
        }),

        control: (base, state) => ({
            ...base,
            background: "var(--background-input)",
            boxShadow: state.isFocused ? 0 : 0,
            borderColor: state.isFocused
                ? "var(--primary-color)"
                : base.borderColor,
            borderWidth: state.isFocused ? "2px" : "1px",
            margin: state.isFocused ? "1px" : "2px",
            '&:hover': {
                borderColor: state.isFocused
                    ? "var(--primary-color)"
                    : base.borderColor,
            }
        }),

        option: (styles, { isFocused }) => ({
            ...styles,
            backgroundColor: isFocused ? "var(--interaction-purple)" : "var(--background-input)",
            color: isFocused ? "var(--primary-color)" : null,
        }),

        noOptionsMessage: (styles) => ({
            ...styles,
            background: "var(--background-input)",
        })
    }

    return (
        <div className={modalStyles.containerOuter + (isMobile() ? (" " + postModalStyles.mobile) : "")}>
            <div className={postModalStyles.wrapper}>
                <div className={postModalStyles.containerInner + ' ' + scrollbarHide}>
                    <div className={postModalStyles.modalContainer}>
                        <div className={postModalStyles.modal + ' ' + (shake ? postModalStyles.error : '')} ref={postRef}>
                            <div className={postModalStyles.top}>
                                <div className={postModalStyles.header + ' ' + postModalStyles.header}>
                                    {
                                        props.postType === POST_VIDEO &&
                                        <h3>Upload</h3>
                                    }
                                    {
                                        props.postType !== POST_VIDEO &&
                                        <TypeSelector submitting={manager.submitting} current={type} />
                                    }
                                    <button className={formStyles.button + ' ' + formStyles.buttonIcon} disabled={manager.submitting} onClick={() => {
                                        setManager(manager => ({
                                            ...manager,
                                            showOptions: true,
                                        }))
                                    }}>
                                        <GearIcon width={18} />
                                    </button>
                                    {
                                        (manager.showOptions && !isMobile()) &&
                                        <div className={actionStyles.actionsMenu} style={{right: 0, marginTop: "30px"}} ref={optionsRef}>
                                            <div className={actionStyles.title}>
                                                <GearIcon height={16} />
                                                <p>Options</p>
                                            </div>
                                            <div className={actionStyles.option} onClick={() => {
                                                setManager(manager => ({ ...manager, private: !manager.private, followersOnly: false, showOptions: false }))
                                            }}>
                                                {
                                                    manager.private &&
                                                    <CheckIcon height={14} />
                                                }
                                                Private
                                            </div>
                                            <div className={actionStyles.option} onClick={() => {
                                                setManager(manager => ({ ...manager, private: false, followersOnly: !manager.followersOnly, showOptions: false }))
                                            }}>
                                                {
                                                    manager.followersOnly &&
                                                    <CheckIcon height={14} />
                                                }
                                                Followers Only
                                            </div>
                                        </div>
                                    }
                                    {
                                        (manager.showOptions && isMobile()) &&
                                        <div className={mobileOptionsStyles.container} onClick={() => {
                                            setManager(manager => ({ ...manager, showOptions: false }))
                                        }}>
                                            <div className={mobileOptionsStyles.options}>
                                                <div className={mobileOptionsStyles.optionGroup}>
                                                    <div className={mobileOptionsStyles.option} onClick={() => {
                                                        setManager(manager => ({ ...manager, private: !manager.private, followersOnly: false, showOptions: false }))
                                                    }}>
                                                        {
                                                            manager.private &&
                                                            <CheckIcon height={14} />
                                                        }
                                                        Private
                                                    </div>
                                                    <div className={mobileOptionsStyles.option} onClick={() => {
                                                        setManager(manager => ({ ...manager, private: false, followersOnly: !manager.followersOnly, showOptions: false }))
                                                    }}>
                                                        {
                                                            manager.followersOnly &&
                                                            <CheckIcon height={14} />
                                                        }
                                                        Followers Only
                                                    </div>
                                                </div>
                                                <div className={mobileOptionsStyles.optionGroup}>
                                                    <div className={mobileOptionsStyles.option}>
                                                        <p>Cancel</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                            {
                                manager.private &&
                                <div className={postModalStyles.top}>
                                    <small className={layoutStyles.flex + ' ' + layoutStyles.alignItemsCenter}>
                                        <InfoIcon height={13} width={13} style={{marginRight: "6px"}} />Only you will be able to see this post.
                                    </small>
                                </div>
                            }
                            {
                                manager.followersOnly &&
                                <div className={postModalStyles.top}>
                                    <small className={layoutStyles.flex + ' ' + layoutStyles.alignItemsCenter}>
                                        <InfoIcon height={13} width={13} style={{marginRight: "6px"}} />Only your followers will be able to see this post.
                                    </small>
                                </div>
                            }
                            <div className={layoutStyles.flex + ' ' + layoutStyles.flexColumn + ' ' + layoutStyles.flexExpandAuto}>
                                {
                                    manager.showCaptcha &&
                                    <div className={postModalStyles.content}>
                                        <div className={layoutStyles.m1}>
                                            <div className={formStyles.formGroup}>
                                                {
                                                    manager.captchaURL &&
                                                    <img
                                                        alt="captcha"
                                                        className={layoutStyles.wF + ' ' + (manager.captchaLoading ? layoutStyles.hide : '')}
                                                        onLoad={() => { setManager(manager => ({ ...manager, captchaLoading: false })) }}
                                                        src={manager.captchaURL}
                                                    />
                                                }
                                                {
                                                    (!manager.captchaURL || manager.captchaLoading) && <CaptchaPlaceholder />
                                                }
                                            </div>
                                            <div className={formStyles.formGroup}>
                                                <div className={formStyles.alert}>
                                                    <div>
                                                        <p>You can <a onClick={handleUpgrade} className={layoutStyles.pointer}>upgrade your account</a> for $3.95/mo to remove captchas (this prevents bots) while supporting development the site.</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={formStyles.formGroup}>
                                                {
                                                    manager.error === "WRONG_SECURITY_CODE" && <label className={formStyles.invalidLabel}>Incorrect security code.</label>
                                                }
                                                <input
                                                    type="text"
                                                    ref={securityCodeRef}
                                                    onChange={handleSecurityCode}
                                                    onKeyPress={checkEnter}
                                                    value={manager.securityCode}
                                                    disabled={manager.submitting}
                                                    maxLength={4}
                                                    className={
                                                        formStyles.input + ' ' +
                                                        (manager.error === "WRONG_SECURITY_CODE" ? formStyles.invalidInput : '')
                                                    }
                                                    placeholder="Security code"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                }
                                {
                                    !manager.showCaptcha &&
                                    <div className={postModalStyles.content}>
                                        {
                                            files.length > 0 && <MediaWrapper />
                                        }
                                    </div>
                                }
                                {
                                    (!manager.showCaptcha && ((props.postType !== POST_VIDEO && type !== POST_VIDEO) || manager.part === 1)) &&
                                    <div className={postModalStyles.content}>
                                        {
                                            (props.postType !== POST_VIDEO && type === POST_VIDEO) &&
                                            <small className={postModalStyles.title}>
                                                * Title required for post to show up on Formerly Chuck's video platform
                                            </small>
                                        }
                                        {
                                            type !== POST_POLL &&
                                            <div className={postModalStyles.title + (type === POST_VIDEO ? ' ' + layoutStyles.pTN : "")}>
                                                <input type="text" placeholder="Title of post"
                                                       className={formStyles.input}
                                                       value={manager.title}
                                                       disabled={manager.submitting}
                                                       onChange={handleTitleChange}
                                                       maxLength={TITLE_LENGTH} />
                                            </div>
                                        }
                                        {
                                            type !== POST_POLL &&
                                            <div className={postModalStyles.body}>
                                                <ReactQuill onChange={handleBodyChange}
                                                            value={manager.body.html}
                                                            className={layoutStyles.flex + ' ' + layoutStyles.flexColumn + ' ' + layoutStyles.flexGrow}
                                                            theme="snow"
                                                            disabled={manager.submitting}
                                                            formats={["bold", "italic", "underline", "link", "header", "strike", "list"]}
                                                            placeholder="Write something..." />
                                                {
                                                    manager.body.length >= BODY_LENGTH &&
                                                    <div className={formStyles.alert + ' ' + m1}>
                                                        You have hit the text limit.
                                                    </div>
                                                }
                                            </div>
                                        }
                                        {
                                            type === POST_POLL && <Poll />
                                        }
                                        {
                                            type === POST_MAGNET && <Magnet />
                                        }
                                        {
                                            props.reblogPost !== null && manager.reblogPost !== null &&
                                            <ReblogPost post={manager.reblogPost} truncateAmount={300}/>
                                        }
                                        {
                                            !hasHitMaxFiles(files, type) && ![POST_MAGNET, POST_POLL].includes(type) &&
                                            <DropAreaSmall postType={props.postType} />
                                        }
                                        {
                                            ((type === POST_VIDEO || props.postType === POST_VIDEO) && manager.part === 1) &&
                                            <div className={postModalStyles.section + ' ' + layoutStyles.p1 + ' ' + layoutStyles.block}>
                                                <div className={switchStyles.switchInput + ' ' + layoutStyles.mL}>
                                                    <p>
                                                        <label>
                                                            <input
                                                                onChange={() => {
                                                                    setManager(manager => ({
                                                                        ...manager,
                                                                        randomThumbnail: !manager.randomThumbnail,
                                                                        thumbnailBlob: null,
                                                                    }));
                                                                }}
                                                                checked={manager.randomThumbnail}
                                                                type="checkbox" />
                                                            <span>Choose random thumbnail from video</span>
                                                        </label>
                                                    </p>
                                                </div>
                                                {
                                                    !manager.randomThumbnail &&
                                                    <>
                                                        <hr className={layoutStyles.mT1 + ' ' + layoutStyles.mB1} />
                                                        <div className={layoutStyles.flex}>
                                                            <div className={layoutStyles.flexGrow}>
                                                                <div className={layoutStyles.block}>
                                                                    <button
                                                                        onClick={() => {
                                                                            thumbnailRef.current.click();
                                                                        }}
                                                                        className={formStyles.button}
                                                                    >
                                                                        Select thumbnail
                                                                    </button>
                                                                    <input
                                                                        className={layoutStyles.hide}
                                                                        ref={thumbnailRef}
                                                                        type="file"
                                                                        accept={POST_IMAGE_EXTENSIONS.map(ext => "." + ext + ",")}
                                                                        onChange={(e) => {
                                                                            if(e.target.files && e.target.files.length){
                                                                                let thumbnailFile = e.target.files[0];

                                                                                if(thumbnailFile.size/1000/1000 > 4){
                                                                                    const Notification = () => (
                                                                                        <div>
                                                                                            Can't be more than 4mb.
                                                                                        </div>
                                                                                    );

                                                                                    toast.error(<Notification />, {
                                                                                        position: "bottom-center",
                                                                                        autoClose: 5000,
                                                                                        hideProgressBar: false,
                                                                                        closeOnClick: true,
                                                                                        pauseOnHover: true,
                                                                                        draggable: true,
                                                                                        progress: undefined,
                                                                                    });
                                                                                    return;
                                                                                }

                                                                                const reader = new FileReader();
                                                                                reader.readAsDataURL(thumbnailFile);
                                                                                reader.onload = (readFile) => {
                                                                                    let image = new Image();
                                                                                    image.src = readFile.target.result;

                                                                                    image.onload = function() {
                                                                                        if (this.width !== 1280 || this.height !== 720) {
                                                                                            const Notification = () => (
                                                                                                <div>
                                                                                                    Not 1280x720!
                                                                                                </div>
                                                                                            );

                                                                                            toast.error(<Notification/>, {
                                                                                                position: "bottom-center",
                                                                                                autoClose: 5000,
                                                                                                hideProgressBar: false,
                                                                                                closeOnClick: true,
                                                                                                pauseOnHover: true,
                                                                                                draggable: true,
                                                                                                progress: undefined,
                                                                                            });

                                                                                            return;
                                                                                        }

                                                                                        setManager(manager => ({
                                                                                            ...manager,
                                                                                            thumbnailBlob: thumbnailFile,
                                                                                        }))
                                                                                    }
                                                                                };
                                                                            }
                                                                        }}
                                                                    />
                                                                </div>
                                                                <small className={layoutStyles.mT1}>* Should be 1280x720, required for Formerly Chuck's video platform</small>
                                                            </div>
                                                            {
                                                                manager.thumbnailBlob &&
                                                                <div className={layoutStyles.mL}>
                                                                    <img
                                                                        src={URL.createObjectURL(manager.thumbnailBlob)}
                                                                        className={postModalStyles.thumbnail}
                                                                        alt="thumbnail"
                                                                    />
                                                                </div>
                                                            }
                                                        </div>
                                                    </>
                                                }
                                            </div>
                                        }
                                        {
                                            manager.reblogError &&
                                            <div className={formStyles.alert + ' ' + formStyles.danger + ' ' + postModalStyles.body}>
                                                There was an error loading the reblog post.
                                            </div>
                                        }
                                        {
                                            manager.error === "CONTENT" && largeFileStatus !== "FAILED" &&
                                            <div className={formStyles.alert + ' ' + formStyles.danger + ' ' + postModalStyles.body}>
                                                Poll, magnet, body, or files required.
                                            </div>
                                        }
                                        {
                                            manager.error === "STORAGE" &&
                                            <div className={formStyles.alert + ' ' + formStyles.danger + ' ' + postModalStyles.body}>
                                                <p>You hit your storage limit. <a onClick={handleUpgrade} className={layoutStyles.pointer}>Upgrade your account</a> for more storage or delete old posts.</p>
                                            </div>
                                        }
                                        {
                                            sizeError !== null &&
                                            <div className={formStyles.alert + ' ' + formStyles.danger + ' ' + postModalStyles.body}>
                                                {sizeError}
                                            </div>
                                        }
                                    </div>
                                }
                                {
                                    !manager.showCaptcha &&
                                    <>
                                        {
                                            ((type === POST_VIDEO || props.postType === POST_VIDEO) && manager.part === 2) &&
                                            <div className={postModalStyles.section + ' ' + layoutStyles.p1}>
                                                <label className={layoutStyles.mB1}>
                                                    Categories: <small>(select up to two)</small>
                                                </label>
                                                <Select
                                                    menuPlacement="top"
                                                    styles={categoriesStyles}
                                                    components={animatedComponents}
                                                    isClearable={manager.submitting}
                                                    value={manager.selectedCategories}
                                                    isDisabled={manager.submitting}
                                                    onChange={handleCategoryChange}
                                                    noOptionsMessage={() => {
                                                        return manager.selectedCategories.length === 2 ? "Select up to two categories." : "No options available";
                                                    }}
                                                    closeMenuOnSelect={false}
                                                    isMulti={true}
                                                    options={
                                                        manager.selectedCategories.length === 2 ? [] :
                                                            manager.categories.map(cat => (
                                                                {label: cat.title, value: cat.id, data: cat.id}
                                                            ))
                                                    }
                                                />
                                                {
                                                    (props.postType !== POST_VIDEO && type === POST_VIDEO) &&
                                                    <small className={layoutStyles.mT1}>
                                                        * Required for post to show up on Formerly Chuck's video platform
                                                    </small>
                                                }
                                            </div>
                                        }
                                        {
                                            !manager.showCaptcha &&
                                            <div className={postModalStyles.content}>
                                                {
                                                    (error && error.message) &&
                                                    <div className={formStyles.alert + ' ' + formStyles.danger + ' ' + postModalStyles.body}>
                                                        {error.message}
                                                    </div>
                                                }
                                            </div>
                                        }
                                        {
                                            tags.length > 0 &&
                                            <div className={postStyles.tagsWrapper}>{tags}</div>
                                        }
                                        {
                                            (((props.postType !== POST_VIDEO && type !== POST_VIDEO) || manager.part === 2) && manager.tags.list.length < MAX_TAGS) &&
                                            <div className={formStyles.formGroup + ' ' + layoutStyles.mTN}>
                                                <input className={formStyles.input + ' ' + postModalStyles.tagInput}
                                                       placeholder="Type tag then press enter..."
                                                       onKeyPress={handleTagSubmit}
                                                       onChange={handleTagInput}
                                                       maxLength={MAX_TAG_LENGTH}
                                                       disabled={manager.submitting}
                                                       value={manager.tags.input}
                                                />
                                            </div>
                                        }
                                        {
                                            ((props.postType !== POST_VIDEO && type !== POST_VIDEO) || manager.part === 2) &&
                                            <NsfwCheckbox submitting={manager.submitting} handleNsfw={handleNsfw} nsfw={manager.nsfw} />
                                        }
                                    </>
                                }
                                {
                                    <div className={postModalStyles.content}>
                                        {
                                            (largeFileStatus !== null && largeFileStatus !== "FAILED") &&
                                            <div className={formStyles.alert + ' ' + postModalStyles.body}>
                                                <div className={layoutStyles.flex + ' ' + layoutStyles.flexColumn + ' ' + layoutStyles.wF}>
                                                    <div className={layoutStyles.flex}>
                                                        <DotsLoading width={20} height={22} />
                                                        <span>Processing file...</span>
                                                        <span className={layoutStyles.mL}>
                                                        {largeFilePart} / {largeFileTotal} chunks
                                                    </span>
                                                    </div>
                                                    <div className={formStyles.progress + ' ' + layoutStyles.mT1}>
                                                        <div className={formStyles.bar}
                                                             style={{width: Math.floor((largeFilePart/largeFileTotal) * 100).toString() + "%"}} />
                                                    </div>
                                                    {
                                                        largeFileStatus === "RETRYING_PART" &&
                                                        <div className={layoutStyles.flex + ' ' + layoutStyles.mT1}>
                                                            <span>Encountered error, retrying part...</span>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        }
                                        {
                                            largeFileStatus === "FAILED" &&
                                            <div className={formStyles.alert + ' ' + postModalStyles.body}>
                                                <p>Something went wrong.</p>
                                            </div>
                                        }
                                    </div>
                                }
                                {
                                    (props.postType === POST_VIDEO || type === POST_VIDEO) &&
                                    <VideoFooter
                                        postButtonDisabled={postVideoButtonDisabled}
                                        nextButtonDisabled={nextVideoButtonDisabled}
                                        handlePart={handlePart}
                                        part={manager.part}
                                        handleCaptchaNext={handleCaptchaNext}
                                        handleCaptchaBack={handleCaptchaBack}
                                        handleSubmit={handleSubmit}
                                        callbackClose={props.closeModal}
                                        isSubmitting={manager.submitting}
                                        securityCodeLength={manager.securityCode.length}
                                        showCaptcha={manager.showCaptcha} />
                                }
                                {
                                    (props.postType !== POST_VIDEO && type !== POST_VIDEO) &&
                                    <Footer
                                        postButtonDisabled={postButtonDisabled}
                                        handleCaptchaNext={handleCaptchaNext}
                                        handleCaptchaBack={handleCaptchaBack}
                                        handleSubmit={handleSubmit}
                                        callbackClose={props.closeModal}
                                        isSubmitting={manager.submitting}
                                        securityCodeLength={manager.securityCode.length}
                                        showCaptcha={manager.showCaptcha} />
                                }
                            </div>
                        </div>
                    </div>
                </div>
                {
                    !hasHitMaxFiles(files, type) && ![POST_MAGNET, POST_POLL].includes(type) &&
                    <DropArea modalWidth={manager.drop.modalWidth} postType={props.postType}/>
                }
            </div>
        </div>
    );
};

PostModal.defaultProps = {
    postType: null,
}

const mapStateToProps = () => {
    const getIsBoosted = makeIsBoosted();

    return (state) => {
        const isBoosted = getIsBoosted(state);

        return {
            isBoosted: isBoosted,
        }
    };
};

export default connect(mapStateToProps)(PostModal);
