import React from "react";
import {Link} from "react-router-dom";

import videoCardStyles from "../../../../../../css/layout/video/video-card.css";

import {videoTime} from "../../../../../../util/date";
import {getThumbnail} from "../../../../../../util/getThumbnail";

function Thumbnail(props) {
    let thumbnail = null;
    if(props.video.attachments.length > 0){
        thumbnail = getThumbnail(props.video.attachments[0].thumbnails, "small");
    }

    return (
        <Link to={`/watch/${props.video.id}`} className={videoCardStyles.thumbnail}>
            <div className={videoCardStyles.poster}>
                {
                    (thumbnail) &&
                    <img src={thumbnail.file.url} alt="Poster" width="9999" />
                }
                {
                    props.video.attachments.length > 0 && props.video.attachments[0].file.duration !== null &&
                    <div className={videoCardStyles.info + ' ' + videoCardStyles.time}>
                        {videoTime(props.video.attachments[0].file.duration)}
                    </div>
                }
            </div>
        </Link>
    );
}

export default Thumbnail;
