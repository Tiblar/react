import React, {useState, useEffect, useRef} from "react";
import axios from "axios";

import layoutStyles from "../../../../css/layout.css";
import mainStyles from "../../../../css/layout/main.css";
import historyStyles from "../../../../css/layout/video/history.css";
import {container as bottomContainer} from "../../../../css/layout/social/container/main.css";

import EmptyGraphic from "../../../../assets/graphics/empty.svg";
import GearIcon from "../../../../assets/svg/icons/gear.svg";

import VideoCard from "../../layout/parts/video/card/VideoCard";
import HistoryOptionsModal from "../../layout/parts/video/HistoryOptionsModal";
import Loading from "../../layout/parts/social/feed/components/Loading";
import MainContainer from "../../layout/parts/video/container/MainContainer";

import {API_URL, BOTTOM_LOAD_HEIGHT} from "../../../../util/constants";

function History(props) {
    const [manager, setManager] = useState({
        history: [],
        offset: 0,
        loading: true,
        reachedEnd: false,
        error: false,
        optionsModal: false,
        lastScroll: new Date(),
    })

    const containerRef = useRef();

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        containerRef.current.addEventListener('scroll', trackScroll);

        return () => {
            containerRef.current.removeEventListener('scroll', trackScroll);
        };
    }, [manager.offset, manager.loading, manager.reachedEnd, manager.error]);

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
            },
        };

        axios.get(API_URL + '/video/history', config)
            .then(function (res) {
                if(res.data.data && res.data.data.history){
                    setManager(manager => ({
                        ...manager,
                        history: [...manager.history, ...res.data.data.history],
                        loading: false,
                        reachedEnd: res.data.data.history.length === 0,
                        offset: manager.offset + 10,
                    }))
                }
            })
            .catch();
    }

    function handleRemove(id) {
        const config = {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        };

        axios.delete(API_URL + '/video/history/' + id, config)
            .then(function (res) {
                const history = manager.history.filter(video => video.id !== id);
                setManager(manager => ({
                    ...manager,
                    history: history,
                }))
            })
            .catch();
    }

    function handleOptionsModal() {
        setManager(manager => ({
            ...manager,
            optionsModal: !manager.optionsModal,
        }))
    }

    return (
        <MainContainer>
            <div className={mainStyles.bottomContent}>
                <div className={bottomContainer} ref={containerRef}>
                    {manager.optionsModal && <HistoryOptionsModal close={handleOptionsModal} />}
                    <div className={historyStyles.container}>
                        <div className={layoutStyles.flex}>
                            <h3>Watch history</h3>
                            <div className={historyStyles.options} onClick={handleOptionsModal}>
                                <GearIcon height={20} width={20} />
                            </div>
                        </div>
                        <hr className={layoutStyles.mB1} />
                        {
                            (!manager.loading && manager.history.length === 0) &&
                            <EmptyGraphic />
                        }
                        {
                            (manager.history.length > 0) &&
                            manager.history.map(history => (
                                <VideoCard
                                    key={history.id}
                                    video={history.post}
                                    horizontal={true}
                                    handleRemove={() => {
                                        handleRemove(history.id)
                                    }}
                                />
                            ))
                        }
                        {
                            manager.loading &&
                            <div>
                                <Loading />
                            </div>
                        }
                    </div>
                </div>
            </div>
        </MainContainer>
    );
}

export default History;
