import React from 'react';

import {CREATE_POST, useVideoDispatch} from "../video/context";
import PostModal from "./manage/PostModal";
import {POST_VIDEO} from "../../../../../util/constants";

function VideoCreate() {

    const dispatch = useVideoDispatch();

    function closeModal() {
        dispatch({ type: CREATE_POST, payload: false });
    }

    return (
        <PostModal reblogPost={null} postType={POST_VIDEO} closeModal={closeModal} />
    );
}

export default VideoCreate;
