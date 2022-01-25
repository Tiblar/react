// @flow

import React from "react";

import postStyles from "../../../../../../../../css/components/post.css";
import formStyles from "../../../../../../../../css/form.css";
import layoutStyles from "../../../../../../../../css/layout.css";

import PlyrComponent from "../../../../../../../../util/components/PlyrComponent";

const Video = (props) => {

let sources = [{ src: props.file.file.url, size: props.file.available_transcoding.h }]
if (props.file.available_transcoding) {
  console.log('detected additional video sources', props.file)

  // keep transcode URLs relative to file.url
  let base = 'http://192.168.253.60:9000/seed/'
  if (!window.location.href.match(/192\.168/)) {
    const parts = props.file.file.url.split('/')
    parts.pop()
    base = parts.join('/') + '/'
  }

  // fix up formats
  const transCodes = props.file.available_transcoding.alts.map(t => { return { src: base + t.path, size: t.res } })
  sources = [...transCodes, { src: props.file.file.url, size: props.file.available_transcoding.h }]
}

    return (
        <div className={postStyles.video}>
            {
                (
                    props.file.file.url.split('.').pop() !== "webm" ||
                    document.createElement('video').canPlayType('video/webm')
                ) &&
                <PlyrComponent autoplay={props.autoplay} sources={{
                    type: 'video',
                    sources: sources,
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
