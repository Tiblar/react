// @flow

import React, {useEffect, useState} from "react";
import axios from "axios";

import layoutStyles from "../../../../css/layout.css";
import {
    bottomContent
} from "../../../../css/layout/main.css";
import mainStyles from "../../../../css/layout/social/container/main.css";

import MainContainer from "../../layout/parts/video/container/MainContainer";
import Categories from "../../layout/parts/video/Categories";
import VideoSection from "../../layout/parts/video/VideoSection";

import {API_URL} from "../../../../util/constants";

function Home() {

    const [manager, setManager] = useState({
        categories: [],
        activeCategories: [],
        loadedCategories: [],
        emptyCategories: [],
        reachedEndCategories: [],
        loadingCategories: [],
        categoryVideos: [],
        newestVideos: [],
        newestEmpty: false,
        newestReachedEnd: false,
        newestLoading: false,
        newestShownCount: 8,
        trendingVideos: [],
        trendingEmpty: false,
        trendingReachedEnd: false,
        trendingLoading: false,
        trendingShownCount: 8,
    });

    useEffect(() => {
        loadNewest();
    }, []);

    useEffect(() => {
        loadTrending();
    }, []);

    useEffect(() => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        axios.get(API_URL + '/video/categories', config)
            .then(res => {
                if(res.data.data && Array.isArray(res.data.data.categories)){
                    setManager(manager => ({
                        ...manager,
                        categories: res.data.data.categories,
                    }));
                }
            })
    }, []);

    useEffect(() => {
        let newCategories = manager.activeCategories.filter(
            category => !manager.loadedCategories.includes(category.id)
        );

        newCategories.forEach(c => loadCategory(c.id));
    }, [manager.activeCategories.length]);

    function loadTrending(offset = 0) {
        setManager(manager => ({
            ...manager,
            trendingLoading: true,
        }))

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const params = {
            params: {
                offset: offset,
                limit: 8,
            },
        }

        axios.get(API_URL + '/video/feed/trending', params, config)
            .then(res => {
                setManager(manager => ({
                    ...manager,
                    trendingVideos: manager.trendingVideos.concat(res.data.data.videos),
                    trendingEmpty: res.data.data.videos.length === 0 && manager.trendingVideos.length === 0,
                    trendingReachedEnd: res.data.data.videos.length < 8,
                    trendingShownCount: offset > 0 ? offset : 8,
                    trendingLoading: false,
                }));
            })
    }


    function loadNewest(offset = 0) {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const params = {
            params: {
                offset: offset,
                limit: 8,
            },
        }

        axios.get(API_URL + '/video/feed/newest', params, config)
            .then(res => {
                setManager(manager => ({
                    ...manager,
                    newestVideos: manager.newestVideos.concat(res.data.data.videos),
                    newestEmpty: res.data.data.videos.length === 0 && manager.newestVideos.length === 0,
                    newestReachedEnd: res.data.data.videos.length < 8,
                    newestShownCount: offset > 0 ? offset : 8,
                    newestLoading: false,
                }));
            })
    }

    function loadCategory(id, offset = 0) {
        let loading = manager.loadingCategories;

        loading.push(id);

        setManager(manager => ({
            ...manager,
            loadingCategories: loading,
        }));

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const params = {
            params: {
                offset: offset,
                limit: 8,
            },
        }

        axios.get(API_URL + `/video/feed/category/${id}/trending`, params, config)
            .then(res => {
                let videos = manager.categoryVideos;
                let empty = manager.emptyCategories;
                let loaded = manager.loadedCategories;
                let loading = manager.loadingCategories.filter(cId => cId !== id);
                let reachedEnd = manager.reachedEndCategories;

                loaded.push(id);

                let cVideos = videos.find(v => v.id === id)

                if(cVideos){
                    cVideos.videos = cVideos.videos.concat(res.data.data.videos)
                }else{
                    videos.push({
                        id: id,
                        videos: res.data.data.videos,
                    });

                    if(res.data.data.videos.length === 0){
                        empty.push(id);
                    }
                }

                if(res.data.data.videos.length < 8){
                    reachedEnd.push(id);
                }

                setManager(manager => ({
                    ...manager,
                    categoryVideos: videos,
                    emptyCategories: empty,
                    loadedCategories: loaded,
                    reachedEndCategories: reachedEnd,
                    loadingCategories: loading,
                }));
            })
    }

    function updateCategories(categories) {
        setManager(manager => ({
            ...manager,
            activeCategories: categories,
        }))
    }

    function handleShowMore(id) {
        let categories = manager.activeCategories;
        let category = categories.find(c => c.id === id);

        if(!manager.reachedEndCategories.find(cId => cId === id)) {
            loadCategory(id, category.shownCount);
        }

        category.shownCount += 8;

        setManager(manager => ({
            ...manager,
            activeCategories: categories,
        }));
    }

    function handleShowLess(id) {
        let categories = manager.activeCategories;
        let category = categories.find(c => c.id === id);

        category.shownCount = 8;

        setManager(manager => ({
            ...manager,
            activeCategories: categories,
        }));
    }

    return (
        <MainContainer>
            <div className={bottomContent}>
                <div className={mainStyles.container}>
                    <div className={layoutStyles.mB2}>
                        <Categories
                            categories={manager.categories}
                            active={manager.activeCategories}
                            updateActiveCategories={updateCategories}
                        />
                        {
                            manager.activeCategories.map(a => {
                                let category = manager.categories.find(c => c.id === a.id);

                                if(!category) return null;

                                let videos = [];
                                let foundVideos = manager.categoryVideos.find(c => c.id === a.id);

                                if(foundVideos){
                                    videos = foundVideos.videos;
                                }

                                let empty = manager.emptyCategories.includes(a.id);
                                let reachedEnd = manager.reachedEndCategories.includes(a.id);
                                let loading = manager.loadingCategories.includes(a.id);

                                return (
                                    <VideoSection
                                        key={category.id}
                                        title={category.title}
                                        videos={videos}
                                        empty={empty}
                                        shownCount={a.shownCount}
                                        showMore={() => {
                                            handleShowMore(a.id)
                                        }}
                                        showLess={() => {
                                            handleShowLess(a.id)
                                        }}
                                        reachedEnd={reachedEnd}
                                        loading={loading}
                                    />
                                )
                            })
                        }
                        <VideoSection
                            title="Trending"
                            videos={manager.trendingVideos}
                            empty={manager.trendingEmpty}
                            shownCount={manager.trendingShownCount}
                            showMore={() =>{
                                loadTrending(manager.trendingShownCount + 8)
                            }}
                            showLess={() => {
                                setManager(manager => ({
                                    ...manager,
                                    trendingShownCount: 8,
                                }))
                            }}
                            reachedEnd={manager.trendingReachedEnd}
                            loading={manager.trendingLoading}
                        />
                        <VideoSection
                            title="Recently Published"
                            videos={manager.newestVideos}
                            empty={manager.newestEmpty}
                            shownCount={manager.newestShownCount}
                            showMore={() =>{
                                loadNewest(manager.newestShownCount + 8)
                            }}
                            showLess={() => {
                                setManager(manager => ({
                                    ...manager,
                                    newestShownCount: 8,
                                }))
                            }}
                            reachedEnd={manager.newestReachedEnd}
                            loading={manager.newestLoading}
                        />
                    </div>
                </div>
            </div>
        </MainContainer>
    );
}

export default Home;
