// @flow

import React, {useState, useRef, useEffect} from "react";
import PropTypes from "prop-types";
import axios from "axios";
import {isMobile} from "is-mobile";

import formStyles from "../../../../../../../../css/form.css";
import layoutStyles from "../../../../../../../../css/layout.css";
import modalStyles from "../../../../../../../../css/components/modal.css";

import LaughIcon from "../../../../../../../../assets/svg/icons/laugh.svg";

import {PostType} from "../../../../../../../../util/types/PostTypes";
import outsideClick from "../../../../../../../../util/components/outsideClick";
import fetchCaptcha from "../../../../../../../../util/captcha";
import ContentLoader from "../../../../../../../../util/components/ContentLoader";
import {API_URL} from "../../../../../../../../util/constants";
import FrownIcon from "../../../../../../../../assets/svg/icons/frown.svg";

function ReportPost(props) {

    const [manager, setManager] = useState({
        securityCode: "",
        captchaURL: null,
        captchaId: null,
        captchaLoading: true,
        submitting: false,
        error: false,
        reported: false,
    })

    const ref = useRef();
    const securityCodeRef = useRef();
    const _isMounted = useRef(true);

    let post = props.post.reblog !== null && (props.post.body === null && props.post.attachments.length === 0)
        ? props.post.reblog : props.post;

    useEffect(() => {
        if(securityCodeRef.current){
            securityCodeRef.current.focus();
        }
    }, [securityCodeRef.current]);

    outsideClick(ref, () => {
        props.cancel();
    });

    useEffect(() => {
        loadCaptcha();

        return () => {
            _isMounted.current = false
        }
    }, []);

    function handleReport() {
        setManager(manager => ({
            ...manager,
            submitting: true,
        }));

        const config = {
            headers: {
                "Content-Type": "application/json",
            }
        };

        const body = {
            security_id: manager.captchaId,
            security_code: manager.securityCode,
        }

        axios
            .post(API_URL + "/report/post/" + post.id, body, config)
            .then(res => {
                setManager(manager => ({
                    ...manager,
                    reported: true,
                }));
            })
            .catch(err => {
                if(err.response && err.response.data.errors && err.response.data.errors.captcha){
                    setManager(manager => ({
                        ...manager,
                        error: "WRONG_SECURITY_CODE",
                        securityCode: "",
                        submitting: false,
                    }));
                    loadCaptcha();
                    return;
                }

                setManager(manager => ({
                    ...manager,
                    submitting: false,
                    error: true,
                }));
            });
    }

    function handleSecurityCode(e) {
        let value = e.target.value;

        setManager(manager => ({
            ...manager,
            securityCode: value
        }))
    }

    function loadCaptcha() {
        fetchCaptcha().then(data => {
            if(_isMounted.current) {
                setManager(manager => ({
                    ...manager,
                    captchaURL: data.captcha,
                    captchaId: data.id,
                }))
            }
        });
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

    return (
        <div className={modalStyles.containerOuter + (isMobile() ? (" " + modalStyles.mobile) : "")}>
            <div className={modalStyles.wrapper}>
                <div className={modalStyles.containerInner}>
                    <div className={modalStyles.modalContainer}>
                        <div className={modalStyles.modal} ref={ref}>
                            <div className={modalStyles.top}>
                                <div className={modalStyles.header}>
                                    <h4>Report Post</h4>
                                </div>
                            </div>
                            {
                                !manager.reported &&
                                <div className={modalStyles.body}>
                                    <p>Confirm that understand:</p>
                                    <ul>
                                        <li>If you believe this post breaks the rules.</li>
                                        <li>Do not report just because you don't like a post.</li>
                                        <li>Frequent misuse of the report button can result in a ban.</li>
                                    </ul>
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
                                        {
                                            manager.error === "WRONG_SECURITY_CODE" && <label className={formStyles.invalidLabel}>Incorrect security code.</label>
                                        }
                                        <input
                                            type="text"
                                            ref={securityCodeRef}
                                            onChange={handleSecurityCode}
                                            value={manager.securityCode}
                                            maxLength={4}
                                            className={
                                                formStyles.input + ' ' +
                                                (manager.error === "WRONG_SECURITY_CODE" ? formStyles.invalidInput : '')
                                            }
                                            placeholder="Security code"
                                        />
                                    </div>
                                </div>
                            }
                            {
                                manager.reported &&
                                <div className={modalStyles.body}>
                                    <div className={
                                        layoutStyles.flex + ' ' + layoutStyles.justifyContentCenter
                                        + ' ' + layoutStyles.mB2 + ' ' + layoutStyles.textSuccess
                                    }>
                                        <LaughIcon width="45%" />
                                    </div>
                                    <div className={layoutStyles.alert + ' ' + layoutStyles.mT1}>
                                        This post has been reported. Thank you.
                                    </div>
                                </div>
                            }
                            {
                                manager.error && manager.error !== "WRONG_SECURITY_CODE" &&
                                <div className={modalStyles.body}>
                                    <div className={
                                        layoutStyles.flex + ' ' + layoutStyles.justifyContentCenter
                                        + ' ' + layoutStyles.mB2 + ' ' + layoutStyles.textDanger
                                    }>
                                        <FrownIcon width="45%" />
                                    </div>
                                    <div className={layoutStyles.alert + ' ' + layoutStyles.mT1}>
                                        There was an error.
                                    </div>
                                </div>
                            }
                            <div className={modalStyles.footer}>
                                <button className={formStyles.button} onClick={props.cancel}>
                                    Close
                                </button>
                                <button className={formStyles.button + ' ' + formStyles.buttonPrimary + ' ' + layoutStyles.mL}
                                        disabled={manager.submitting || manager.securityCode.length === 0}
                                        onClick={handleReport}>
                                    Report
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

ReportPost.propTypes = {
    post: PostType,
    cancel: PropTypes.func.isRequired,
}

export default ReportPost;
