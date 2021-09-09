import React, {useState, useRef, useEffect} from "react";
import axios from "axios";

import mainStyles from "../../../../css/layout/main.css";
import layoutStyles from "../../../../css/layout.css";
import historyStyles from "../../../../css/layout/video/history.css";
import {container as bottomContainer} from "../../../../css/layout/social/container/main.css";

import EmptyGraphic from "../../../../assets/graphics/empty.svg";

import VideoCard from "../../layout/parts/video/card/VideoCard";
import Loading from "../../layout/parts/social/feed/components/Loading";
import MainContainer from "../../layout/parts/video/container/MainContainer";

import {API_URL, BOTTOM_LOAD_HEIGHT} from "../../../../util/constants";
import formStyles from "../../../../css/form.css";
import {mT1} from "../../../../css/layout.css";

function Following(props) {

    const [manager, setManager] = useState({
        videos: [],
        offset: 0,
        loading: true,
        reachedEnd: false,
        error: false,
        lastScroll: new Date(),
    })

    const containerRef = useRef();

    useEffect(() => {
        setManager(manager => ({
            ...manager,
            videos: [],
            offset: 0,
            loading: true,
            reachedEnd: false,
            error: false,
            lastScroll: new Date(),
        }))
    }, [props.match.params.query]);

    useEffect(() => {
        fetchPosts();
    }, [manager.offset === 0]);

    useEffect(() => {
        containerRef.current.addEventListener('scroll', trackScroll);

        return () => {
            containerRef.current.removeEventListener('scroll', trackScroll);
        };
    }, [manager.offset, manager.loading, manager.reachedEnd, manager.error, props.match.params.query]);

    const trackScroll = (e) => {
        setManager(manager => ({
            ...manager,
            lastScroll: new Date(),
        }))

        if(
            (e.target.scrollHeight - e.target.scrollTop - e.target.offsetHeight < BOTTOM_LOAD_HEIGHT
                && !manager.loading && !manager.reachedEnd && !manager.error && (new Date() - manager.lastScroll) > 250)
        ) {
            setManager(manager => ({
                ...manager,
                loading: true,
                lastScroll: new Date(),
            }))

            fetchPosts();
        }
    };

    function fetchPosts() {
        const config = {
            headers: {
                "Content-Type": "multipart/form-data"
            },
            params: {
                offset: manager.offset,
                query: props.match.params.query,
            },
        };

        axios.get(API_URL + '/video/feed/following', config)
            .then(function (res) {
                if(res.data.data && res.data.data.videos){
                    setManager(manager => ({
                        ...manager,
                        videos: [...manager.videos, ...res.data.data.videos],
                        loading: false,
                        reachedEnd: res.data.data.videos.length === 0,
                        offset: manager.offset + 10,
                    }))
                }
            })
            .catch();
    }

    return (
        <MainContainer>
            <div className={mainStyles.bottomContent}>
                <div className={bottomContainer} ref={containerRef}>
                    <div className={historyStyles.container}>
                        <h3>Following</h3>
                        <hr className={layoutStyles.mB1} />
                        {
                            (!manager.loading && manager.videos.length === 0) &&
                            <EmptyGraphic />
                        }
                        {
                            (manager.videos.length > 0) &&
                            manager.videos.map(video => (
                                <VideoCard
                                    key={video.id}
                                    video={video}
                                    horizontal={true}
                                />
                            ))
                        }
                        {
                            manager.loading &&
                            <div>
                                <Loading />
                            </div>
                        }
                        {
                            manager.reachedEnd &&
                            <div className={formStyles.alert + ' ' + mT1}>
                                You have reached the end!
                            </div>
                        }
                    </div>
                </div>
            </div>
        </MainContainer>
    );
}

export default Following;
