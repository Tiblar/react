// @flow

import React, {useState, useRef} from "react";
import {toast} from "react-toastify";
import {connect} from "react-redux";
import axios from "axios";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import {isMobile} from "is-mobile";

import postStyles from "../../../../../../../css/components/post.css";
import formStyles from "../../../../../../../css/form.css";
import mobileOptionsStyles from "../../../../../../../css/components/mobile-options.css";
import layoutStyles from "../../../../../../../css/layout.css";

import ClockIcon from "../../../../../../../assets/svg/icons/clock.svg";
import ReblogIcon from "../../../../../../../assets/svg/icons/reblog.svg";
import CogIcon from "../../../../../../../assets/svg/icons/gear.svg";
import InfoIcon from "../../../../../../../assets/svg/icons/info.svg";
import EllipseVIcon from "../../../../../../../assets/svg/icons/ellipsisV.svg";

import ProfilePicture from "../../../user/ProfilePicture";
import ConfirmModal from "../../../ConfirmModal";
import Info from "./header/Info";
import ReportPost from "./header/ReportPost";
import InteractionsModal from "./header/InteractionsModal";
import VisibilityModal from "./header/VisibilityModal";
import ListModal from "./header/ListModal";
import CopyButton from "../../../../../../../util/components/CopyButton";

import {colorizeStyle} from "../../../../../../../util/colorizeStyle";
import useWindowDimensions from "../../../../../../../util/hooks/useWindowDimensions";
import outsideClick from "../../../../../../../util/components/outsideClick";
import {formatDate} from "../../../../../../../util/date";
import {PostType} from "../../../../../../../util/types/PostTypes";
import store from "../../../../../../../store";
import {deletePost, pinPost} from "../../../../../../../reducers/social/actions";
import {API_URL, MAX_MOBILE_WIDTH, WEB_URL} from "../../../../../../../util/constants";
import {numberToString} from "../../../../../../../util/formatNumber";

function Header(props) {
    const {width} = useWindowDimensions();

    let isReblogged = props.post.reblog !== null && (props.post.body === null && props.post.attachments.length === 0);

    let [manager, setManager] = useState({
        showOptions: false,
        showInfo: false,
        interactionsModal: false,
        visibilityModal: false,
        listModal: false,
        mobilePopup: false,
        confirm: {
            pinPost: false,
            unpinPost: false,
            deletePost: false,
            reportPost: false,
        }
    });

    const optionsRef = useRef();
    const infoRef = useRef();

    function error() {
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

    function handlePin() {
        if(!props.auth.isAuthenticated) return;

        axios({
            url: API_URL + "/post/pin" + (!props.post.pinned ? "/" + props.post.id : ''),
            method: props.post.pinned ? 'delete' : 'post',
            headers: {
                "Content-Type": "application/json"
            },
        }).then(res => {
            const Notification = () => (
                <div>
                    {props.post.pinned ? "Pinned" : "Unpinned"} post!
                </div>
            );

            toast(<Notification />, {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            store.dispatch(pinPost(props.post.id));
            handleConfirm("pinPost", false);
            handleConfirm("unpinPost", false);
        }).catch(err => {
            error();
        });
    }

    function handleDelete() {
        if(!props.auth.isAuthenticated) return;

        axios({
            url: API_URL + "/post/" + props.post.id,
            method: "delete",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            const Notification = () => (
                <div>
                    Deleted post!
                </div>
            );

            toast(<Notification />, {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            store.dispatch(deletePost(props.post.id));
        }).catch(err => {
            error();
        });
    }

    function handleConfirm(modal, status) {
        setManager(manager => ({
            ...manager,
            confirm: {
                ...manager.confirm,
                [modal]: status
            }
        }));
    }

    function handleCancelReport() {
        setManager(manager => ({
            ...manager,
            confirm: {
                ...manager.confirm,
                reportPost: false
            }
        }))
    }

    function handleVisibility() {
        setManager(manager => ({
            ...manager,
            visibilityModal: !manager.visibilityModal,
        }))
    }

    function handleList() {
        setManager(manager => ({
            ...manager,
            listModal: !manager.listModal,
        }))
    }

    function handleInteractions() {
        setManager(manager => ({
            ...manager,
            interactionsModal: !manager.interactionsModal,
        }))
    }

    function handleMobilePopup() {
        setManager(manager => ({
            ...manager,
            mobilePopup: !manager.mobilePopup,
        }))
    }

    outsideClick(optionsRef, () => {
        if (manager.showOptions) {
            setManager(manager => ({
                ...manager,
                showOptions: false
            }));
        }
    });

    outsideClick(infoRef, () => {
        if (manager.showInfo) {
            setManager(manager => ({
                ...manager,
                showInfo: false
            }));
        }
    });

    let username = props.post.author.info.username.length > 15
        ? props.post.author.info.username.substr(0, 15) + "..." : props.post.author.info.username;

    return (
        <div className={postStyles.header}>
            {
                manager.confirm.pinPost &&
                <ConfirmModal header="Pin post" body="By pinning this post it will remove any previous pinned post and make the post public if it is private. Please confirm"
                              cancel={() => { handleConfirm("pinPost", false) }}
                              callback={handlePin} />
            }
            {
                manager.confirm.unpinPost &&
                <ConfirmModal header="Unpin post" body="Do you wish to unpin this post? Please confirm"
                              cancel={() => { handleConfirm("unpinPost", false) }}
                              callback={handlePin} />
            }
            {
                manager.confirm.deletePost &&
                <ConfirmModal header="Delete post" body="You cannot recover a deleted post. It will be completely removed from Tiblar. Please confirm"
                              cancel={() => { handleConfirm("deletePost", false) }}
                              callback={handleDelete} />
            }
            {
                manager.confirm.reportPost &&
                <ReportPost post={props.post} cancel={handleCancelReport} />
            }
            {
                manager.visibilityModal &&
                <VisibilityModal post={props.post} close={handleVisibility} />
            }
            {
                manager.listModal &&
                <ListModal post={props.post} close={handleList} />
            }
            {
                manager.interactionsModal &&
                <InteractionsModal post={props.post} close={handleInteractions} />
            }
            {
                isReblogged === false &&
                <ProfilePicture profilePreview={true}
                                user={props.post.author}
                                small={width <= MAX_MOBILE_WIDTH}
                                popup={true} />
            }
            {
                isReblogged === true &&
                <ProfilePicture profilePreview={true}
                                user={props.post.reblog.author}
                                small={width <= MAX_MOBILE_WIDTH}
                                popup={true} />
            }
            <Link to={`/${props.post.author.info.username}`}>
                <h4 style={colorizeStyle(props.post.author.info.username_color)}>
                    {username}
                </h4>
            </Link>
            {
                isReblogged === true &&
                <div className={postStyles.reblog}>
                    <ReblogIcon height={18} />
                    <Link to={`/${props.post.reblog.author.info.username}`}>
                        <h4 style={colorizeStyle(props.post.reblog.author.info.username_color)}>
                            {props.post.reblog.author.info.username}
                        </h4>
                    </Link>
                </div>
            }
            {
                width > MAX_MOBILE_WIDTH && !isMobile() &&
                <span className={postStyles.date}><ClockIcon width="15" height="15" />{formatDate(props.post.timestamp)}</span>
            }
            {
                width <= MAX_MOBILE_WIDTH && !isMobile() &&
                <span className={postStyles.mobileInfoIcon}
                      onClick={() => { setManager(manager => ({ ...manager, showInfo: true })) }}>
                    <InfoIcon width="15" height="15" />
                </span>
            }
            {
                manager.showInfo && <Info post={props.post} ref={infoRef} />
            }
            {
                props.auth.isAuthenticated && !isMobile() &&
                ((props.post.author.id !== props.auth.user.id))
                && !props.previewProfile
                &&
                <div className={postStyles.options} onClick={() => { setManager(manager => ({ ...manager, showOptions: !manager.showOptions })) }}>
                    <EllipseVIcon height={16} width={16} />
                    {
                        manager.showOptions &&
                        <div className={formStyles.dropdownMenu + ' ' + formStyles.dropdownMenuRight} ref={optionsRef} style={{right: "10px"}}>
                            <div className={formStyles.dropdownItem} onClick={handleList}>
                                <li>
                                    Add to list
                                </li>
                            </div>
                            <div className={formStyles.dropdownItem} onClick={() => { handleConfirm("reportPost", true) }}>
                                <li>
                                    Report
                                </li>
                            </div>
                        </div>
                    }
                </div>
            }
            {
                props.auth.isAuthenticated && !isMobile() &&
                ((props.post.author.id === props.auth.user.id) && (isReblogged === false))
                && !props.previewProfile
                &&
                <div className={postStyles.options} onClick={() => { setManager(manager => ({ ...manager, showOptions: !manager.showOptions })) }}>
                    <CogIcon height={16} width={16}/>
                    {
                        manager.showOptions &&
                        <div className={formStyles.dropdownMenu + ' ' + formStyles.dropdownMenuRight} ref={optionsRef} style={{right: "10px"}}>
                            {
                                !props.post.pinned &&
                                <div className={formStyles.dropdownItem} onClick={() => { handleConfirm("pinPost", true) }}>
                                    <li>
                                        Pin
                                    </li>
                                </div>
                            }
                            {
                                props.post.pinned &&
                                <div className={formStyles.dropdownItem} onClick={() => { handleConfirm("unpinPost", true) }}>
                                    <li>
                                        Unpin
                                    </li>
                                </div>
                            }
                            <div className={formStyles.dropdownItem} onClick={handleList}>
                                <li>
                                    Add to list
                                </li>
                            </div>
                            <div className={formStyles.dropdownItem} onClick={handleVisibility}>
                                <li>
                                    Visibility
                                </li>
                            </div>
                            <div className={formStyles.dropdownItem} onClick={handleInteractions}>
                                <li>
                                    Interactions
                                </li>
                            </div>
                            <div className={formStyles.dropdownItem} onClick={() => { handleConfirm("deletePost", true) }}>
                                <li>
                                    Delete
                                </li>
                            </div>
                        </div>
                    }
                </div>
            }
            {
                isMobile() &&
                <div className={postStyles.mobileOptions} onClick={handleMobilePopup}>
                    <EllipseVIcon height={16} width={16} />
                </div>
            }
            {
                manager.mobilePopup &&
                <div className={mobileOptionsStyles.container} onClick={handleMobilePopup}>
                    <div className={mobileOptionsStyles.options}>
                        <div className={mobileOptionsStyles.optionGroup}>
                            <div className={mobileOptionsStyles.info}>
                                <span className={mobileOptionsStyles.date}><ClockIcon width="15" height="15" />{formatDate(props.post.timestamp)}</span>
                                <span>&nbsp;-&nbsp;</span>
                                <div className={mobileOptionsStyles.views}>
                                    {numberToString(props.post.views)} Views
                                </div>
                            </div>
                        </div>
                        <div className={mobileOptionsStyles.optionGroup}>
                            <div className={mobileOptionsStyles.option}>
                                <CopyButton className={formStyles.button + ' ' + layoutStyles.wF} copyText={WEB_URL + "/post/" + props.post.id}>
                                    Copy Link
                                </CopyButton>
                            </div>
                            <div className={mobileOptionsStyles.option}>
                                <Link className={formStyles.button} target="_blank" to={"/post/" + props.post.id}>
                                    Open Post
                                </Link>
                            </div>
                        </div>
                        {
                            props.auth.isAuthenticated &&
                            ((props.post.author.id !== props.auth.user.id))
                            && !props.previewProfile
                            &&
                            <div className={mobileOptionsStyles.optionGroup}>
                                <div className={mobileOptionsStyles.option} onClick={handleList}>
                                    <p>Add to list</p>
                                </div>
                                <div className={mobileOptionsStyles.option + ' ' + mobileOptionsStyles.danger}
                                     onClick={() => { handleConfirm("reportPost", true) }}>
                                    <p>Report</p>
                                </div>
                            </div>
                        }
                        {
                            props.auth.isAuthenticated &&
                            ((props.post.author.id === props.auth.user.id) && (isReblogged === false))
                            && !props.previewProfile
                            &&
                            <div className={mobileOptionsStyles.optionGroup}>
                                {
                                    !props.post.pinned &&
                                    <div className={mobileOptionsStyles.option} onClick={() => { handleConfirm("pinPost", true) }}>
                                        <p>
                                            Pin
                                        </p>
                                    </div>
                                }
                                {
                                    props.post.pinned &&
                                    <div className={mobileOptionsStyles.option} onClick={() => { handleConfirm("unpinPost", true) }}>
                                        <p>
                                            Unpin
                                        </p>
                                    </div>
                                }
                                <div className={mobileOptionsStyles.option} onClick={handleList}>
                                    <p>
                                        Add to list
                                    </p>
                                </div>
                                <div className={mobileOptionsStyles.option} onClick={handleVisibility}>
                                    <p>
                                        Visibility
                                    </p>
                                </div>
                                <div className={mobileOptionsStyles.option} onClick={handleInteractions}>
                                    <p>
                                        Interactions
                                    </p>
                                </div>
                                <div className={mobileOptionsStyles.option + ' ' + mobileOptionsStyles.danger}
                                     onClick={() => { handleConfirm("deletePost", true) }}>
                                    <p>
                                        Delete
                                    </p>
                                </div>
                            </div>
                        }
                        <div className={mobileOptionsStyles.optionGroup}>
                            <div className={mobileOptionsStyles.option}>
                                <p>Cancel</p>
                            </div>
                        </div>
                    </div>

                </div>
            }
            <Link className={postStyles.postLink} target="_blank" to={`/post/${props.post.id}`}/>
        </div>
    );
}

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth };
};

Header.propTypes = {
    post: PostType,
    previewProfile: PropTypes.bool,
}

Header.defaultProps = {
    previewProfile: false,
}

export default connect(mapStateToProps)(Header);
