import React from 'react';

import {CREATE_POST, useSocialDispatch, useSocialState} from "../social/context";
import PostModal from "./manage/PostModal";

function SocialCreate() {

    const {reblogPost} = useSocialState();

    const dispatch = useSocialDispatch();

    function closeModal() {
        dispatch({ type: CREATE_POST, payload: false });
    }

    return (
      <PostModal reblogPost={reblogPost} closeModal={closeModal} />
    );
}

export default SocialCreate;
