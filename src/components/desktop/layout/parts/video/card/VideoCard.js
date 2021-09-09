import React from "react";
import {Link} from "react-router-dom";
import isMobile from "is-mobile";

import videoCardStyles from "../../../../../../css/layout/video/video-card.css";

import TimesIcon from "../../../../../../assets/svg/icons/times.svg";

import ProfilePicture from "../../user/ProfilePicture";
import Thumbnail from "./Thumbnail";

import {dateRound} from "../../../../../../util/date";
import {numberToString} from "../../../../../../util/formatNumber";

function VideoCard(props) {

    return (
        <div className={videoCardStyles.card + (props.horizontal === true ? ' ' + videoCardStyles.horizontal : '') + (props.small === true ? ' ' + videoCardStyles.small : '')}>
            <Thumbnail video={props.video} />
            <div className={videoCardStyles.infoContainer}>
                {
                    props.horizontal !== true &&
                    <div className={videoCardStyles.profile}>
                        <ProfilePicture user={props.video.author} small={true} />
                    </div>
                }
                <div className={videoCardStyles.info}>
                    <Link to={`/watch/${props.video.id}`}>
                        {
                            (props.small === true || isMobile()) &&
                            <p>{props.video.title}</p>
                        }
                        {
                            (props.small !== true && !isMobile()) &&
                            <h3>{props.video.title}</h3>
                        }
                        {
                            props.video.views !== 1 &&
                            <p className={videoCardStyles.views}>{numberToString(props.video.views)} views&nbsp;·&nbsp;{dateRound(props.video.timestamp)}</p>
                        }
                        {
                            props.video.views === 1 &&
                            <p className={videoCardStyles.views}>{numberToString(props.video.views)} view&nbsp;·&nbsp;{dateRound(props.video.timestamp)}</p>
                        }
                    </Link>
                    {
                        props.horizontal === true &&
                        <div className={videoCardStyles.profile}>
                            <ProfilePicture user={props.video.author} small={true} />
                            <p className={videoCardStyles.username}>{props.video.author.info.username}</p>
                        </div>
                    }
                </div>
            </div>
            {
                (props.horizontal === true && props.handleRemove) &&
                <div className={videoCardStyles.removeContainer}>
                    <div className={videoCardStyles.remove} onClick={props.handleRemove}>
                        <TimesIcon height={20} width={20} />
                    </div>
                </div>
            }
        </div>
    );
}

export default VideoCard;
