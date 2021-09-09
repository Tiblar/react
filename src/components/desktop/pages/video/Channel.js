import React, {useState, useEffect, useRef} from "react";
import axios from "axios";
import {toast} from "react-toastify";

import channelStyles from "../../../../css/layout/video/channel.css";
import mainStyles from "../../../../css/layout/video/container/main.css";
import formStyles from "../../../../css/form.css";
import layoutStyles from "../../../../css/layout.css";

import VideoCard from "../../layout/parts/video/card/VideoCard";

import Empty from "../../../../assets/graphics/empty.svg";

import {API_URL, BOTTOM_LOAD_HEIGHT} from "../../../../util/constants";
import history from "../../../../util/history";

function Channel(props) {

    const urlParams = new URLSearchParams(window.location.search);

    let input = null;
    if(urlParams.get('q') !== null){
        input = decodeURIComponent(urlParams.get('q'));
    }

    const [manager, setManager] = useState({
        videos: [],
        offset: 0,
        loading: true,
        reachedEnd: false,
        error: false,
        optionsModal: false,
        lastScroll: new Date(),
        query: input,
    })

    const containerRef = useRef();

    useEffect(() => {
        const unlisten = history.listen( location =>  {
            const urlParams = new URLSearchParams(location.search);

            setManager(manager => ({
                ...manager,
                query: urlParams.get('q'),
                videos: [],
                offset: 0,
                loading: true,
                reachedEnd: false,
                error: false,
                optionsModal: false,
                lastScroll: new Date(),
            }))
        });

        return () => {
            unlisten();
        }
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [manager.query, props.match.params.username]);

    useEffect(() => {
        containerRef.current.addEventListener('scroll', trackScroll);

        return () => {
            containerRef.current.removeEventListener('scroll', trackScroll);
        };
    }, [manager.offset, manager.loading, manager.reachedEnd, manager.error, props.match.params.username]);

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
        console.log('fetch posts')
        const config = {
            headers: {
                "Content-Type": "multipart/form-data"
            },
            params: {
                offset: manager.offset,
                q: manager.query,
            },
        };

        axios.get(API_URL + `/users/profile/${props.match.params.username}/videos`, config)
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
            .catch(err => {
                const Notification = () => (
                    <div>
                        An error occurred!
                    </div>
                );

                toast.error(<Notification />, {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            });
    }

    return (
        <div className={channelStyles.container} ref={containerRef}>
            <div className={mainStyles.contentSection}>
                <div className={mainStyles.content}>
                    {
                        manager.videos
                            .map((video) => (
                                <VideoCard video={video} key={video.id} />
                            ))
                    }
                    {
                        (!manager.loading && manager.videos.length === 0) &&
                        <div className={layoutStyles.flex + ' ' + layoutStyles.flexExpandAuto + ' ' + layoutStyles.m1}>
                            <div className={layoutStyles.flexExpandAuto + ' ' + layoutStyles.mL + ' ' + layoutStyles.mR}>
                                <Empty className={layoutStyles.wF} />
                                <div className={formStyles.alert + ' ' + layoutStyles.flexGrow}>
                                    No videos here!
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default Channel;
