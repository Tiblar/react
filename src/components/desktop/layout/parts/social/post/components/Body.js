// @flow

import React, {useState, useEffect} from "react";
import DOMPurify from "dompurify";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import {connect} from "react-redux";

import postStyles from "../../../../../../../css/components/post.css";
import {mTN, pBN} from "../../../../../../../css/layout.css";
import formStyles, {button} from "../../../../../../../css/form.css";

import ReblogPost from "../ReblogPost";
import MediaWrapper from "../media/MediaWrapper";

import {smartSubstr} from "../../../../../../../util/smartSubstr";

import {PostType} from "../../../../../../../util/types/PostTypes";
import {UserType} from "../../../../../../../util/types/UserTypes";
import Poll from "../media/poll/Poll";
import Magnet from "../media/magnet/Magnet";
import {parseMentions} from "../../../../../../../util/parsePost";

function Body(props) {
    const [manager, setManager] = useState({
        showNsfw: false,
    });

    function handleNsfw() {
        setManager(manager => ({ ...manager, showNsfw: true }));
    }

    let post = props.post.reblog !== null && (props.post.body === null && props.post.attachments.length === 0)
        ? props.post.reblog : props.post;

    let re = /<([a-z]+)(?=[\s>])(?:[^>=]|='[^']*'|="[^"]*"|=[^'"\s]*)*\s?\/?>/g;

    let count = 0;

    if(post.body !== null){
        count = (post.body.match(re) || []).length;
    }

    let maxLength = 1000;
    if(count > 40){
        maxLength = 150;
    }

    let html = props.truncate ? smartSubstr(DOMPurify.sanitize(post.body), maxLength) : DOMPurify.sanitize(post.body);

    html = parseMentions(html, post.mentions);

    return (
        <main>
            {
                (!post.nsfw || (manager.showNsfw || !(props.auth.user === null || props.auth.user.nsfw_filter))) &&
                <MediaWrapper views={post.views} attachments={post.attachments} />
            }
            {
                (!manager.showNsfw && post.nsfw && (props.auth.user === null || props.auth.user.nsfw_filter)) &&
                <div className={postStyles.nsfw}>
                    {
                        props.auth.user === null && "This post contains NSFW."
                    }
                    {
                        props.auth.user !== null &&
                        "This post contains NSFW content. You can disable the filter in your settings."
                    }
                    <button className={formStyles.button + ' ' + postStyles.show} onClick={handleNsfw}>Show</button>
                </div>
            }
            {
                (post.body !== null || post.title !== null ) && (!post.nsfw || (manager.showNsfw || !(props.auth.user === null || props.auth.user.nsfw_filter))) &&
                <div className={postStyles.body + ' ' + (post.attachments.length > 0 ? mTN : '') + ' ' + (post.tags.length > 0 ? pBN : '')}>
                    {post.title !== null && <h4>{post.title}</h4>}
                    {post.body !== null && <p dangerouslySetInnerHTML={{ __html: html }} />}
                    {
                        props.truncate && smartSubstr(DOMPurify.sanitize(post.body), maxLength).length !== DOMPurify.sanitize(post.body).length &&
                        <Link to={`/post/${post.id}`} target="_blank">read more</Link>
                    }
                </div>
            }
            {
                post.poll !== null && <Poll post={props.post} poll={post.poll} />
            }
            {
                post.magnet !== null && <Magnet magnet={post.magnet} />
            }
            {post.reblog !== null && <ReblogPost post={post.reblog} truncateAmount={300} />}
            {
                post.tags.length > 0 && !props.previewProfile && (!props.profile || props.profileUser !== null) &&
                <div className={postStyles.tagsWrapper}>
                    {post.tags.map((tag) => (
                        <Link key={tag.id}
                              to={props.profile ? `/${props.profileUser.info.username}?q=${tag.title}` : `/search/${encodeURIComponent(tag.title)}`}
                              className={postStyles.tag}>
                            <label>#{tag.title}</label>
                        </Link>
                    ))}
                </div>
            }
            {
                post.tags.length > 0 && props.previewProfile && props.profileUser !== null &&
                <div className={postStyles.tagsWrapper}>
                    {post.tags.map((tag) => (
                        <Link key={tag.id}
                              to={`/${props.profileUser.info.username}?q=${tag.title}`}
                              className={postStyles.tag}>
                            <label>#{tag.title}</label>
                        </Link>
                    ))}
                </div>
            }
        </main>
    );
}

Body.propTypes = {
    profile: PropTypes.bool,
    profileUser: UserType,
    previewProfile: PropTypes.bool,
    post: PostType.isRequired,
    truncate: PropTypes.bool,
};

Body.defaultProps = {
    profile: false,
    profileUser: null,
    previewProfile: false,
    truncate: true,
}

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth, };
};

export default connect(mapStateToProps)(Body);
