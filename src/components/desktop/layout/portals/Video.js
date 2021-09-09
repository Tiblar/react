// @flow

import React  from "react";

import VideoCreate from "../parts/post/VideoCreate";
import AutoAuth from "../AutoAuth";
import {VideoProvider, useVideoState} from "../parts/video/context";
import {ManageProvider} from "../parts/post/manage/context";

function Video(props) {
    const CreatePost = () => {
        const {createPost} = useVideoState();

        if(createPost){
            return (<ManageProvider><VideoCreate /></ManageProvider>);
        }

        return null;
    };

    return (
        <VideoProvider>
            <AutoAuth>
                <CreatePost />
                {props.children}
            </AutoAuth>
        </VideoProvider>
    );
}

export default Video;
