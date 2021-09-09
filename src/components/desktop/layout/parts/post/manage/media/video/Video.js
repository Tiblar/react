// @flow

import React from "react";

import postStyles from "../../../../../../../../css/components/post.css";

import PlyrComponent from "../../../../../../../../util/components/PlyrComponent";

const Video = (props) => {

    return (
        <div className={postStyles.video}>
            <PlyrComponent sources={{
                type: 'video',
                sources: [
                    {
                        src: props.file.blob,
                    },
                ],
            }}/>
        </div>
    );
};

export default Video;
