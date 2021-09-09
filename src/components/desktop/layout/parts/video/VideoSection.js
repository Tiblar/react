import React from "react";
import PropTypes from "prop-types";

import videoStyles from "../../../../../css/layout/video/container/main.css";
import formStyles, {button} from "../../../../../css/form.css";
import layoutStyles from "../../../../../css/layout.css";
import {divider} from "../../../../../css/layout/social/container/main.css";

import VideoCard from "./card/VideoCard";

import useWindowDimensions from "../../../../../util/hooks/useWindowDimensions";

function VideoSection(props) {
    const {width} = useWindowDimensions();

    return (
        <>
            <div className={videoStyles.contentSection}>
                <h3 className={videoStyles.header}>{props.title}</h3>
                {width < 800 ? <hr /> : null}
                <div className={videoStyles.content}>
                    {
                        props.videos
                            .filter((i, index) => (index < props.shownCount))
                            .map((video) => (
                                <VideoCard video={video} key={video.id} />
                            ))
                    }
                </div>
                {
                    props.empty === true &&
                    <div className={formStyles.alert + ' ' + layoutStyles.mB1}>
                        No videos found.
                    </div>
                }
            </div>
            {
                ((!props.empty && props.videos.length > 8 || !props.reachedEnd) && !props.loading) &&
                <div className={videoStyles.showMore}>
                    <div className={divider}>
                        {
                            (props.videos.length > props.shownCount || !props.reachedEnd) &&
                            <button
                                className={button + ' ' + layoutStyles.mR1}
                                onClick={() => {
                                    props.showMore();
                                }}
                            >
                                {props.shownCount > 8 ? "More" : "Show More"}
                            </button>
                        }
                        {
                            props.shownCount > 8 &&
                            <button
                                className={button}
                                onClick={() => {
                                    props.showLess();
                                }}
                            >
                                {props.videos.length < props.shownCount ? "Show Less" : "Less"}
                            </button>
                        }
                    </div>
                </div>
            }
        </>
    )
}

VideoSection.propTypes = {
    title: PropTypes.string.isRequired,
    videos: PropTypes.array.isRequired,
    empty: PropTypes.bool.isRequired,
    shownCount: PropTypes.number.isRequired,
    showMore: PropTypes.func.isRequired,
    showLess: PropTypes.func.isRequired,
    reachedEnd: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
}

export default VideoSection;
