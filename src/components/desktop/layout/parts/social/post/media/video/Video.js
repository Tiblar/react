// @flow

import React from "react";

import postStyles from "../../../../../../../../css/components/post.css";
import formStyles from "../../../../../../../../css/form.css";
import layoutStyles from "../../../../../../../../css/layout.css";

import PlyrComponent from "../../../../../../../../util/components/PlyrComponent";

const Video = (props) => {

    return (
        <div className={postStyles.video}>
            {
                (
                    props.file.file.url.split('.').pop() !== "webm" ||
                    document.createElement('video').canPlayType('video/webm')
                ) &&
                <PlyrComponent autoplay={props.autoplay} sources={{
                    type: 'video',
                    sources: [
                        {
                            src: props.file.file.url,
                        },
                    ],
                }}/>
            }
            {
                (
                    props.file.file.url.split('.').pop() === "webm" &&
                    !(!!document.createElement('video').canPlayType('video/webm'))
                ) &&
                <div className={formStyles.alert + ' ' + layoutStyles.m1}>
                    Your browser does not support webm files.
                </div>
            }
        </div>
    );
};

Video.defaultProps = {
    autoplay: false,
}

export default Video;
