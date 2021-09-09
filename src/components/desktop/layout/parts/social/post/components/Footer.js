// @flow

import React, {useState} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";

import postStyles from "../../../../../../../css/components/post.css";
import {button} from "../../../../../../../css/form.css";
import {mL} from "../../../../../../../css/layout.css";

import EyeIcon from "../../../../../../../assets/svg/icons/eyeSlash.svg";
import ReplyIcon from "../../../../../../../assets/svg/icons/comments.svg";

import FavoriteButton from "./footer/FavoriteButton";
import ReblogButton from "./footer/ReblogButton";
import RepliesContainer from "./footer/RepliesContainer";
import CommentsModal from "./footer/CommentsModal";

import useWindowDimensions from "../../../../../../../util/hooks/useWindowDimensions";

function Footer(props) {
    let [manager, setManager] = useState({
        viewReplies: false,
        commentModal: false,
    });

    const { width } = useWindowDimensions();

    let post = props.post.reblog !== null && (props.post.body === null && props.post.attachments.length === 0)
        ? props.post.reblog : props.post;

    function viewReplies() {
        setManager(manager => ({
            ...manager,
            viewReplies: !manager.viewReplies
        }));
    }

    function viewCommentModal() {
        setManager(manager => ({
            ...manager,
            commentModal: !manager.commentModal
        }));
    }

    return (
        <div className={postStyles.footer}>
            <div className={postStyles.interactions}>
                <FavoriteButton post={props.post}/>
                <ReblogButton post={props.post}/>
                {
                    (width > 1000) &&
                    <button className={button + ' ' + postStyles.interaction  + ' ' + mL + ' ' + (manager.viewReplies ? postStyles.view : '')}
                            onClick={viewReplies}>
                        {manager.viewReplies ? <EyeIcon height="16" /> : <ReplyIcon height="16" />}
                        <span>{post.replies_count}</span>
                    </button>
                }
                {
                    (width <= 1000) &&
                    <button className={button + ' ' + postStyles.interaction  + ' ' + mL} onClick={viewCommentModal}>
                        <ReplyIcon height="16" />
                        <span>{post.replies_count}</span>
                    </button>
                }
            </div>
            {
                manager.viewReplies &&
                <RepliesContainer post={props.post} />
            }
            {
                manager.commentModal &&
                <CommentsModal post={props.post} close={viewCommentModal} />
            }
        </div>
    );
}

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth };
};

Footer.propTypes = {
    grid: PropTypes.bool,
}

Footer.defaultProps = {
    grid: false,
}

export default connect(mapStateToProps)(Footer);
