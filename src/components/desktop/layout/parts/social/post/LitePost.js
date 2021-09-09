// @flow

import React from "react";
import DOMPurify from "dompurify";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {PostType} from "../../../../../../util/types/PostTypes";
import PropTypes from "prop-types";

import postStyles from "../../../../../../css/components/post.css";
import layoutStyles, {mTN, mLN} from "../../../../../../css/layout.css";
import formStyles from "../../../../../../css/form.css";

import ClockIcon from "../../../../../../assets/svg/icons/clock.svg";

import {formatDate} from "../../../../../../util/date";
import {smartSubstr} from "../../../../../../util/smartSubstr";

import PostMediaWrapper from "./media/MediaWrapper";
import Magnet from "./media/magnet/Magnet";

function LitePost(props) {

    let html = Number.isInteger(props.truncateAmount) ? smartSubstr(DOMPurify.sanitize(props.post.body), props.truncateAmount) : DOMPurify.sanitize(props.post.body);

    return (
        <div className={postStyles.post + ' ' + layoutStyles.mB1}>
            <div className={postStyles.header}>
                <h4 className={mLN}>
                    {props.post.author.info.username}
                </h4>
                <span className={postStyles.date}><ClockIcon width="15" height="15" />{formatDate(props.post.timestamp)}</span>
                <Link className={postStyles.postLink} target="_blank" to={`/post/${props.post.id}`}/>
            </div>
            <main>
                <PostMediaWrapper attachments={props.post.attachments}/>
                {
                    (props.post.body !== null || props.post.title !== null) &&
                    <div className={
                        postStyles.body + ' '
                        + (props.post.attachments.length > 0 ? mTN : '')
                    }>
                        {
                            props.post.title !== null &&
                            <h4>{props.post.title}</h4>
                        }
                        {
                            props.post.body !== null &&
                            <p dangerouslySetInnerHTML={{ __html: smartSubstr(html) }} />
                        }
                    </div>
                }
                {
                    props.post.magnet !== null && <div className={layoutStyles.mB1}><Magnet magnet={props.post.magnet} /></div>
                }
                {
                    props.post.poll !== null && <Link target="_blank" className={formStyles.button + ' ' + layoutStyles.m1} to={`/post/${props.post.id}`}>View Poll</Link>
                }
                {
                    props.post.reblog !== null && <Link target="_blank" className={formStyles.button + ' ' + layoutStyles.m1} to={`/post/${props.post.id}`}>View Reblog</Link>
                }
            </main>
        </div>
    );
}

LitePost.propTypes = {
    post: PostType,
    truncateAmount: PropTypes.number,
}

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth };
};

export default connect(mapStateToProps)(LitePost);
