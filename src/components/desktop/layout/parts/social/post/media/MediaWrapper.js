// @flow

import React, {createRef, useEffect, useRef, useState} from "react";

import postStyles from "../../../../../../../css/components/post.css";

import ImageContainer from "./image/ImageContainer";
import FileContainer from "./file/FileContainer";
import VideoContainer from "./video/VideoContainer";

import {
    POST_AUDIO,
    POST_FILE,
    POST_IMAGE,
    POST_MAGNET,
    POST_PDF,
    POST_TEXT,
    POST_VIDEO
} from "../../../../../../../util/constants";
import getPostType from "../../../../../../../util/getPostType";

import useWindowDimensions from "../../../../../../../util/hooks/useWindowDimensions";

const MediaWrapper = (props) => {
    let ref = createRef();
    const _isMounted = useRef(true);
    const {width} = useWindowDimensions();

    let [manager, setManager] = useState({
        containerWidth: null,
        type: POST_TEXT
    })

    useEffect(() => {
        return () => {
            _isMounted.current = false
        }
    }, []);

    useEffect(() => {
        if(ref.current !== null && _isMounted.current) {
            setManager(manager => ({
                ...manager,
                containerWidth: ref.current.offsetWidth
            }));
        }
    }, [ref.current, width])

    useEffect( () => {
        async function setPostType() {
            if(props.attachments.length === 0 || !_isMounted.current) return;

            let type = await getPostType(props.attachments[0].file.url);

            if(_isMounted.current){
                setManager(manager => ({
                    ...manager,
                    type: type,
                }));
            }
        }

        setPostType();
    }, [props.attachments]);

    return (
        <div className={postStyles.mediaWrapper} ref={ref}>
            {manager.type === POST_IMAGE && <ImageContainer files={props.attachments} containerWidth={manager.containerWidth}/>}
            {manager.type === POST_VIDEO && <VideoContainer views={props.views} files={props.attachments}/>}
            {[POST_AUDIO, POST_PDF, POST_FILE].includes(manager.type) && <FileContainer files={props.attachments} type={manager.type}/>}
        </div>
    );
};

export default MediaWrapper;