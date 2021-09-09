// @flow

import React, {createRef, useEffect, useState} from "react";

import postStyles from "../../../../../../../css/components/post.css";

import {useManageState} from "../context";
import ImageContainer from "./image/ImageContainer";
import FileContainer from "./file/FileContainer";
import {POST_AUDIO, POST_FILE, POST_IMAGE, POST_PDF, POST_VIDEO} from "../../../../../../../util/constants";
import VideoContainer from "./video/VideoContainer";

const MediaWrapper = (props) => {
    const {type} = useManageState();

    let ref = createRef();

    let [manager, setManager] = useState({
        containerWidth: null
    })

    useEffect(() => {
        if(ref.current !== null) {
            setManager({
                containerWidth: ref.current.offsetWidth
            });
        }
    }, [ref.current])

    return (
        <div className={postStyles.mediaWrapper} ref={ref}>
            {type === POST_IMAGE && <ImageContainer containerWidth={manager.containerWidth}/>}
            {type === POST_VIDEO && <VideoContainer/>}
            {[POST_AUDIO, POST_PDF, POST_FILE].includes(type) && <FileContainer/>}
        </div>
    );
};

export default MediaWrapper;
