// @flow

import React, {useEffect, useState} from "react";

import postStyles from "../../../../../../../../css/components/post.css";

import {useManageState} from "../../context";
import Video from "./Video";
import Row from "../file/Row";

const VideoContainer = (props) => {
    let { files } = useManageState();

    return (
        <div className={postStyles.rows}>
            {files.map(file => (
                <Row file={file} key={file.id}>
                    <Video file={file}/>
                </Row>
            ))}
        </div>
    );
};

export default VideoContainer;
