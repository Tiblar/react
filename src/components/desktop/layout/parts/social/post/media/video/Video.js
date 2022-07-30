// @flow

import React from "react";

import postStyles from "../../../../../../../../css/components/post.css";
import formStyles from "../../../../../../../../css/form.css";
import layoutStyles from "../../../../../../../../css/layout.css";

import PlyrComponent from "../../../../../../../../util/components/PlyrComponent";

const Video = (props) => {
//
let sources
// set initial source
if (props.file.available_transcoding) {
  // still in use somewhere
  console.log('setting default source', props.file.available_transcoding.h)
  sources = [{ src: props.file.file.url, size: props.file.available_transcoding.h }]
} else
if (props.file.available_transcodes) {
  // for socials
  sources = [{ src: props.file.file.url, size: props.file.available_transcodes.h }]
  //console.log('in socials:', sources, props.file)
} else
if (props.file.file.height) {
  sources = [{ src: props.file.file.url, size: props.file.file.height }]
} else {
  console.log('no height in props:', props)
  sources = [{ src: props.file.file.url }]
}

// set additional sources
if (props.file && (props.file.available_transcoding || props.file.available_transcodes)) {
  console.log('detected additional video sources in', props.file)

  // keep transcode URLs relative to file.url
  let base = 'http://192.168.253.60:9000/seed/'
  if (!window.location.href.match(/192\.168/)) {
    const parts = props.file.file.url.split('/')
    parts.pop()
    base = parts.join('/') + '/'
  }

  // fix up formats
  if (props.file.available_transcoding) { // this has to be first
    const transCodes = props.file.available_transcoding.alts.map(t => { return { src: base + t.path, size: t.res } })
    console.log('setting source', transCodes)
    sources = [...transCodes, { src: props.file.file.url, size: props.file.available_transcoding.h }]
  } else
  if (props.file.available_transcodes) { // this is sometimes set without data
    const transCodes = props.file.available_transcodes.alts.map(t => { return { src: base + t.path, size: t.res } })
    sources = [...transCodes, { src: props.file.file.url, size: props.file.available_transcodes.h }]
  }
  console.log('setting available sources', sources)
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
