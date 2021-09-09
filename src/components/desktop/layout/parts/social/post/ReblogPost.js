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

function ReblogPost(props) {

    let html = Number.isInteger(props.truncateAmount) ? smartSubstr(DOMPurify.sanitize(props.post.body), props.truncateAmount) : DOMPurify.sanitize(props.post.body);

    return (
        <div className={postStyles.post + ' ' + postStyles.reblog}>
            <div className={postStyles.header}>
                <h4 className={mLN}>
                    {props.post.author.info.username}
                </h4>
                <span className={postStyles.date}><ClockIcon width="15" height="15" />{formatDate(props.post.timestamp)}</span>
                <Link className={postStyles.postLink} target="_blank" to={`/post/${props.post.id}`}/>
            </div>
            <main>
                <PostMediaWrapper views={props.post.views} attachments={props.post.attachments}/>
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
            </main>
        </div>
    );
}

ReblogPost.propTypes = {
    post: PostType,
    truncateAmount: PropTypes.number,
}

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth };
};

export default connect(mapStateToProps)(ReblogPost);
