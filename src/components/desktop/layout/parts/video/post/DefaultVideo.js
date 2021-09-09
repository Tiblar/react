import React, {useState} from "react";
import DOMPurify from "dompurify";
import isMobile from "is-mobile";

import videoStyles from '../../../../../../css/components/video.css';
import layoutStyles from '../../../../../../css/layout.css';
import formStyles from '../../../../../../css/form.css';

import Video from "../../social/post/media/video/Video";
import ProfilePicture from "../../user/ProfilePicture";
import RepliesContainer from "../../social/post/components/footer/RepliesContainer";

import {formatBreakDate} from "../../../../../../util/date";
import FollowButton from "../../profile/default/FollowButton";
import FavoriteButton from "../../social/post/components/footer/FavoriteButton";
import {smartSubstr} from "../../../../../../util/smartSubstr";
import {parseMentions} from "../../../../../../util/parsePost";
import CommentsModal from "../../social/post/components/footer/CommentsModal";

function DefaultVideo(props) {

    const [manager, setManager] = useState({
        body: false,
        comments: false,
    })

    let re = /<([a-z]+)(?=[\s>])(?:[^>=]|='[^']*'|="[^"]*"|=[^'"\s]*)*\s?\/?>/g;

    let count = 0;

    if(props.video.body !== null){
        count = (props.video.body.match(re) || []).length;
    }

    let maxLength = 200;
    if(count > 40){
        maxLength = 150;
    }

    let html = !manager.body ? smartSubstr(DOMPurify.sanitize(props.video.body), maxLength) : DOMPurify.sanitize(props.video.body);

    html = parseMentions(html, props.video.mentions);

    return (
        <div className={videoStyles.video}>
            <Video file={props.video.attachments[0]} autoplay={true} />
            <div className={videoStyles.top}>
                <div className={videoStyles.info}>
                    <h3>{props.video.title}</h3>
                    <div className={videoStyles.subTitle}>
                        {
                            props.video.views !== 1 &&
                            <p>{props.video.views}&nbsp;views&nbsp;·&nbsp;{formatBreakDate(props.video.timestamp)}</p>
                        }
                        {
                            props.video.views === 1 &&
                            <p>{props.video.views}&nbsp;view&nbsp;·&nbsp;{formatBreakDate(props.video.timestamp)}</p>
                        }
                    </div>
                </div>
                <FavoriteButton post={props.video} callback={props.favorite} />
            </div>
            <div className={videoStyles.userInfo}>
                <ProfilePicture user={props.video.author} />
                <div className={videoStyles.user}>
                    <h3>{props.video.author.info.username}</h3>
                    {
                        props.video.author.info.follower_count !== 1 &&
                        <p>{props.video.author.info.follower_count}&nbsp;Followers</p>
                    }
                    {
                        props.video.author.info.follower_count === 1 &&
                        <p>{props.video.author.info.follower_count}&nbsp;Follower</p>
                    }
                </div>
                <div className={videoStyles.followButton}>
                    <FollowButton
                        user={props.video.author}
                        followCallback={() => {
                            let video = props.video;
                            video.author.info.following = true;
                            props.setVideo(video)
                        }}
                        unfollowCallback={() => {
                            let video = props.video;
                            video.author.info.following = false;
                            props.setVideo(video)
                        }}
                    />
                </div>
            </div>
            {
                props.video.body &&
                <div className={videoStyles.body}>
                    <p dangerouslySetInnerHTML={{ __html: html }} />
                    {
                        (!manager.body && props.video.body.length > maxLength) &&
                        <a
                            onClick={() => {
                                setManager(manager => ({
                                    ...manager,
                                    body: true,
                                }))
                            }}
                            className={layoutStyles.pointer}
                        >
                            Read more
                        </a>
                    }
                </div>
            }
            {
                !isMobile() &&
                <div className={videoStyles.comments}>
                    <RepliesContainer post={props.video} top={true} />
                </div>
            }
            {
                isMobile() &&
                <div className={layoutStyles.m1 + ' ' + layoutStyles.flex}>
                    <button
                        className={formStyles.button + ' ' + layoutStyles.flexGrow}
                        onClick={() => {
                            setManager(manager => ({
                                ...manager,
                                comments: true,
                            }))
                        }}
                    >
                        {
                            props.video && `View ${props.video.replies_count} Comment${props.video.replies_count !== 1 ? 's' : ''}`
                        }
                        {
                            !props.video && "View Comments"
                        }
                    </button>
                </div>
            }
            {
                manager.comments &&
                <CommentsModal
                    close={() => {
                        setManager(manager => ({
                            ...manager,
                            comments: false,
                        }))
                    }}
                    post={props.video}
                />
            }
        </div>
    );
}

export default DefaultVideo;
