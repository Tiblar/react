// @flow

import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import axios from "axios";

import mainStyles from "../../../../css/layout/main.css";
import {container as bottomContainer} from "../../../../css/layout/social/container/main.css";
import formStyles from "../../../../css/form.css";
import layoutStyles from "../../../../css/layout.css";
import watchStyles from "../../../../css/layout/video/watch.css";

import MainContainer from "../../layout/parts/video/container/MainContainer";
import DefaultVideo from "../../layout/parts/video/post/DefaultVideo";
import VideoCard from "../../layout/parts/video/card/VideoCard";

import {API_URL, POST_VIDEO_EXTENSIONS} from "../../../../util/constants";
import history from "../../../../util/history";
import store from "../../../../store";
import {updatePath} from "../../../../reducers/portal/actions";
import useWindowDimensions from "../../../../util/hooks/useWindowDimensions";

function Watch(props) {
    const {width} = useWindowDimensions();

    const [manager, setManager] = useState({
        video: null,
        recommendations: null,
        showAllRecommendations: false,
        notFound: false,
    })

    useEffect(() => {
        if(!props.match.params.id){
            setManager(manager => ({
                ...manager,
                notFound: true,
            }));
        }

        const config = {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        };
        axios.get(API_URL + '/post/' + props.match.params.id, config)
            .then(function (res) {
                if(res.data.data && res.data.data.posts && res.data.data.posts.length > 0){
                    let post = res.data.data.posts[0];

                    if(post.attachments.length === 0 || !POST_VIDEO_EXTENSIONS.includes(post.attachments[0].original_name.split('.').pop())){
                        store.dispatch(updatePath("/video"));
                        history.push("/post/" + props.match.params.id)
                        return;
                    }

                    setManager(manager => ({
                        ...manager,
                        video: post,
                    }))
                }
            })
            .catch();

        axios.get(API_URL + '/video/recommend/videos/' + props.match.params.id, config)
            .then(function (res) {
                if(res.data.data && res.data.data.posts && res.data.data.posts.length > 0){
                    setManager(manager => ({
                        ...manager,
                        recommendations: res.data.data.posts,
                    }))
                }
            })
            .catch();
    }, [props.match.params.id]);

    return (
        <MainContainer key={props.match.params.id}>
            <div className={mainStyles.bottomContent}>
                <div className={bottomContainer}>
                    <div className={watchStyles.container}>
                        <div className={watchStyles.video}>
                            {
                                manager.video &&
                                <DefaultVideo
                                    video={manager.video}
                                    key={manager.video.id}
                                    setVideo={(video) => {
                                        setManager(manager => ({
                                            ...manager,
                                            video: video,
                                        }));
                                    }}
                                    favorite={(status) => {
                                        let favoritesCount = manager.video.favorites_count;

                                        if(status){
                                            favoritesCount++;
                                        }else{
                                            favoritesCount--;
                                        }

                                        setManager(manager => ({
                                            ...manager,
                                            video: {
                                                ...manager.video,
                                                is_favorited: status,
                                                favorites_count: favoritesCount,
                                            },
                                        }));
                                    }}
                                />
                            }
                        </div>
                        {
                            manager.recommendations &&
                            <div className={watchStyles.recommendations}>
                                {
                                    manager.recommendations
                                        .slice(0, manager.showAllRecommendations ? manager.recommendations.length : 10)
                                        .map(video =>
                                            <VideoCard
                                                key={video.id}
                                                video={video}
                                                horizontal={width > 800}
                                                small={true}
                                            />
                                        )
                                }
                                {
                                    !manager.showAllRecommendations &&
                                    <div className={layoutStyles.flex}>
                                        <button
                                            className={formStyles.button + ' ' + layoutStyles.flexGrow}
                                            onClick={() => {
                                                setManager(manager => ({
                                                    ...manager,
                                                    showAllRecommendations: true,
                                                }))
                                            }}
                                        >
                                            Show All
                                        </button>
                                    </div>
                                }
                            </div>
                        }
                    </div>
                </div>
            </div>
        </MainContainer>
    );
}

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth };
};

export default connect(mapStateToProps)(Watch);
