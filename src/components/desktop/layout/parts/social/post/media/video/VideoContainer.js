// @flow

import React from "react";

import postStyles from "../../../../../../../../css/components/post.css";

import Video from "./Video";
import Row from "../file/Row";
import {numberToString} from "../../../../../../../../util/formatNumber";

const VideoContainer = (props) => {
    return (
        <div className={postStyles.rows}>
            {props.files.map(file => (
                <Row file={file} key={file.id}>
                    <Video file={file}/>
                </Row>
            ))}
            <p className={postStyles.views}>{numberToString(props.views)} views</p>
        </div>
    );
};

export default VideoContainer;
