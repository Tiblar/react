import React from "react";
import PropTypes from "prop-types";

import RepliesContainer from "./RepliesContainer";

import modalStyles from "../../../../../../../../css/components/modal.css";
import layoutStyles from "../../../../../../../../css/layout.css";
import postStyles from "../../../../../../../../css/components/post.css";
import topStyles from "../../../../../../../../css/layout/social/nav/top.css";

import TimesIcon from "../../../../../../../../assets/svg/icons/times.svg";

import {PostType} from "../../../../../../../../util/types/PostTypes";

function CommentsModal(props) {
    return (
        <div className={modalStyles.containerOuter + ' ' + postStyles.commentModal + ' ' + modalStyles.mobile}>
            <div className={modalStyles.wrapper}>
                <div className={modalStyles.containerInner}>
                    <div className={modalStyles.modalContainer}>
                        <div className={modalStyles.modal}>
                            <div className={modalStyles.top}>
                                <div className={modalStyles.header}>
                                    <TimesIcon height={35} width={35} className={topStyles.icon + " " + layoutStyles.mR1} onClick={props.close} />
                                    <h3>Comments</h3>
                                </div>
                            </div>
                            <div className={modalStyles.body + ' ' + layoutStyles.flex + ' ' + layoutStyles.flexColumn + ' ' + layoutStyles.pN}>
                                <RepliesContainer post={props.post} fill={true} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

CommentsModal.propTypes = {
    post: PostType,
    close: PropTypes.func,
}

export default CommentsModal;