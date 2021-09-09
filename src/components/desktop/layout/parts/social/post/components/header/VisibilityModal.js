// @flow

import React, {useRef, useState} from "react";
import PropTypes from "prop-types";
import axios from "axios";
import {isMobile} from "is-mobile";

import formStyles from "../../../../../../../../css/form.css";
import modalStyles from "../../../../../../../../css/components/modal.css";
import layoutStyles, {mT1} from "../../../../../../../../css/layout.css";
import nStyles from "../../../../../../../../css/components/notification.css";
import navStyles from "../../../../../../../../css/components/tabs-nav.css";
import {withGap} from "../../../../../../../../css/components/radio.css";

import CircleLoading from "../../../../../../../../assets/loading/circle-loading.svg";

import outsideClick from "../../../../../../../../util/components/outsideClick";

import {PostType} from "../../../../../../../../util/types/PostTypes";
import {API_URL} from "../../../../../../../../util/constants";
import store from "../../../../../../../../store";
import {followerPost, privatePost} from "../../../../../../../../reducers/social/actions";

const VisibilityModal = (props) => {
    const ref = useRef();

    const [manager, setManager] = useState({
        loading: true,
        error: false,
    });

    function handleEveryone() {
        handleUpdate(`/post/visibility/${props.post.id}/everyone`, false, false)
    }

    function handlePrivate() {
        handleUpdate(`/post/visibility/${props.post.id}/private`, true, false)
    }

    function handleFollowers() {
        handleUpdate(`/post/visibility/${props.post.id}/followers`, false, true)
    }

    function handleUpdate(path, isPrivate, isFollowerPost) {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        axios.patch(API_URL + path, config)
            .then(res => {
                store.dispatch(privatePost(props.post.id, isPrivate));
                store.dispatch(followerPost(props.post.id, isFollowerPost));

                setManager(manager => ({
                    ...manager,
                    error: false,
                    loading: false,
                }));
            })
            .catch(err => {
                setManager(manager => ({
                    ...manager,
                    error: true,
                    loading: false,
                }));
            });
    }

    outsideClick(ref, () => {
        props.close();
    });

    return (
        <div className={modalStyles.containerOuter + (isMobile() ? (" " + modalStyles.mobile) : "")}>
            <div className={modalStyles.wrapper}>
                <div className={modalStyles.containerInner}>
                    <div className={modalStyles.modalContainer}>
                        <div className={modalStyles.modal} ref={ref}>
                            <div className={modalStyles.top}>
                                <div className={modalStyles.header}>
                                    <h4>Visibility</h4>
                                </div>
                            </div>
                            <div className={modalStyles.body}>
                                <div className={formStyles.formGroup}>
                                    <label>Allow post to be viewed by:</label>
                                    <label>
                                        <input name="view"
                                               checked={props.post.private === false && props.post.followers_only === false}
                                               onChange={handleEveryone}
                                               className={withGap}
                                               type="radio" />
                                        <span>Everyone</span>
                                    </label>
                                    <label>
                                        <input name="view"
                                               checked={props.post.private === true && props.post.followers_only === false}
                                               onChange={handlePrivate}
                                               className={withGap}
                                               type="radio" />
                                        <span>Only me</span>
                                    </label>
                                    <label>
                                        <input name="view"
                                               checked={props.post.private === false && props.post.followers_only === true}
                                               onChange={handleFollowers}
                                               className={withGap}
                                               type="radio" />
                                        <span>My Followers</span>
                                    </label>
                                </div>
                                {
                                    manager.error &&
                                    <div className={formStyles.alert + ' ' + formStyles.danger + ' ' + layoutStyles.mT1}>
                                        Something went wrong.
                                    </div>
                                }
                            </div>
                            <div className={modalStyles.footer}>
                                <button className={formStyles.button} onClick={props.close}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

VisibilityModal.propTypes = {
    post: PostType.isRequired,
    close: PropTypes.func.isRequired,
}

export default VisibilityModal;