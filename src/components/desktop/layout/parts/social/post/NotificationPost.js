// @flow

import React, {useState} from "react";
import DOMPurify from "dompurify";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {PostType} from "../../../../../../util/types/PostTypes";

import postStyles from "../../../../../../css/components/post.css";
import layoutStyles, {mLN} from "../../../../../../css/layout.css";
import formStyles from "../../../../../../css/form.css";

import ClockIcon from "../../../../../../assets/svg/icons/clock.svg";

import {formatDate} from "../../../../../../util/date";
import {smartSubstr} from "../../../../../../util/smartSubstr";

import PostMediaWrapper from "./media/MediaWrapper";
import useWindowDimensions from "../../../../../../util/hooks/useWindowDimensions";
import {MAX_MOBILE_WIDTH} from "../../../../../../util/constants";
import history from "../../../../../../util/history";

function NotificationPost(props) {

    const {width} = useWindowDimensions();

    const [manager, setManager] = useState({
        showMedia: false,
    })

    function handleShowMedia() {
        setManager(manager => ({
            ...manager,
            showMedia: true,
        }));
    }

    function handleRedirect() {
        if(width < MAX_MOBILE_WIDTH){
            history.push("/post/" + props.post.id);
        }
    }

    let html = smartSubstr(DOMPurify.sanitize(props.post.body), 20);
    let postUsername = props.post.author.info.username.length > 10 ?
        smartSubstr(DOMPurify.sanitize(props.post.author.info.username), 10) + ".." : props.post.author.info.username;

    return (
        <div className={postStyles.post + ' ' + postStyles.notification}>
            <div className={postStyles.header + ' ' + layoutStyles.border0} onClick={handleRedirect}>
                <p className={mLN}>
                    {postUsername}
                </p>
                <span className={postStyles.date}><ClockIcon width="15" height="15" />{formatDate(props.post.timestamp)}</span>
                <Link className={postStyles.postLink} target="_blank" to={`/post/${props.post.id}`}/>
            </div>
            <main>
                {
                    html &&
                    <div className={postStyles.body}>
                        <p dangerouslySetInnerHTML={{ __html: smartSubstr(html) }} />
                    </div>
                }
                {
                    (props.post.attachments.length > 0 && manager.showMedia) &&
                    <PostMediaWrapper attachments={props.post.attachments}/>
                }
                {
                    (props.post.attachments.length > 0 && !manager.showMedia) &&
                    <div className={layoutStyles.m1}>
                        <div className={layoutStyles.flex + ' ' + layoutStyles.alignItemsCenter}>
                            <button onClick={handleShowMedia} className={formStyles.button}>
                                View Media
                            </button>
                        </div>
                    </div>
                }
            </main>
        </div>
    );
}

NotificationPost.propTypes = {
    post: PostType,
}

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth };
};

export default connect(mapStateToProps)(NotificationPost);
