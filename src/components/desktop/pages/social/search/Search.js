// @flow

import React, {useEffect, useRef, useState} from "react";
import {connect} from "react-redux";
import 'perfect-scrollbar/css/perfect-scrollbar.css';
import Masonry from 'react-masonry-component';
import axios from "axios";

import layoutStyles, {mT1, mL1, flex} from "../../../../../css/layout.css";
import mainStyles, {postContainer} from "../../../../../css/layout/social/container/main.css";
import switchStyles from "../../../../../css/components/switch.css";

import Loading from "../../../layout/parts/social/feed/components/Loading";
import Error from "../../../layout/parts/social/feed/components/Error";
import Empty from "../../../layout/parts/social/feed/components/Empty";
import DefaultPost from "../../../layout/parts/social/post/DefaultPost";
import PeriodDropdown from "../../../layout/parts/social/feed/components/PeriodDropdown";
import SortDropdown from "../../../layout/parts/social/feed/components/SortDropdown";
import TypeDropdown from "../../../layout/parts/social/search/TypeDropdown";
import Container from "../../../layout/parts/social/feed/SearchContainer";

import {fetchPosts, reset} from "../../../../../reducers/social/actions";
import store from "../../../../../store";
import {API_URL, MAX_MOBILE_WIDTH} from "../../../../../util/constants";
import useWindowDimensions from "../../../../../util/hooks/useWindowDimensions";

function Search(props) {
    const gridRef = useRef();
    const masonryRef = useRef();
    const _isMounted = useRef(true);
    const {width} = useWindowDimensions();

    let localNSFWFilter = localStorage.getItem("search_nsfw_filter");

    const [manager, setManager] = useState({
        profiles: [],
        nsfwFilter: typeof localNSFWFilter === "string" && JSON.parse(localNSFWFilter) === true,
    });

    useEffect(() => {
        return () => {
            _isMounted.current = false
        }
    }, []);

    useEffect(() => {
        setTimeout(() => {
            if(masonryRef.current !== undefined && _isMounted.current){
                masonryRef.current.performLayout();
            }
        }, 1500);
    }, []);

    useEffect(() => {
        store.dispatch(reset());

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        axios.get(API_URL + '/search/social/profiles', config)
            .then(function (res) {
                if(res.data.data.profiles !== undefined){
                    setManager(manager => ({
                        ...manager,
                        profiles: res.data.data.profiles
                    }));
                }
            })
            .catch(function (err) {

            });
    }, [props.match.params.query]);

    function fetch() {
        let params = {};

        if(props.social.sort === "popular"){
            params.period = props.social.period;
        }

        if(props.social.type !== "all"){
            params.type = props.social.type;
        }

        params.offset = props.social.offset;
        params.query = decodeURIComponent(props.match.params.query);
        params.nsfw = manager.nsfwFilter ? 1 : 0;

        store.dispatch(fetchPosts("/search/social/" + props.social.sort, params, "posts"));
    }

    function handleNSFWFilter(e) {
        setManager(manager => ({
            ...manager,
            nsfwFilter: e.target.checked,
        }))

        localStorage.setItem("search_nsfw_filter", e.target.checked);

        store.dispatch(reset());
    }

    let posts = [];
    props.social.posts.map((post) => {
        posts.push(<DefaultPost key={post.id} grid={true} postId={post.id}/>);
    });

    return (
        <Container fetchPosts={fetch}>
            {
                width > MAX_MOBILE_WIDTH &&
                <div className={flex + ' ' + mainStyles.optionsContainer}>
                    {
                        !props.social.error &&
                        <SortDropdown />
                    }
                    {
                        !props.social.error && props.social.sort === "popular" &&
                        <div className={mL1}>
                            <PeriodDropdown />
                        </div>
                    }
                    {
                        !props.social.error &&
                        <div className={mL1}>
                            <TypeDropdown />
                        </div>
                    }
                    {
                        !props.social.error &&
                        <div className={switchStyles.switchInput + ' ' + layoutStyles.flex + ' ' + layoutStyles.mL1}>
                            <label className={layoutStyles.flex + ' ' + layoutStyles.alignItemsCenter}>
                                <input checked={manager.nsfwFilter}
                                       onChange={handleNSFWFilter}
                                       type="checkbox"/>{" "}
                                <span className={switchStyles.lever} />
                                View NSFW
                            </label>
                        </div>
                    }
                </div>
            }
            {
                width <= MAX_MOBILE_WIDTH &&
                <div className={mainStyles.optionsContainer}>
                    <div className={flex}>
                        {
                            !props.social.error &&
                            <SortDropdown />
                        }
                        {
                            !props.social.error && props.social.sort === "popular" &&
                            <div className={mL1}>
                                <PeriodDropdown />
                            </div>
                        }
                    </div>
                    <div className={flex + ' ' + layoutStyles.mT1}>
                        {
                            !props.social.error &&
                            <div>
                                <TypeDropdown />
                            </div>
                        }
                        {
                            !props.social.error &&
                            <div className={switchStyles.switchInput + ' ' + layoutStyles.flex + ' ' + mL1}>
                                <label className={layoutStyles.flex + ' ' + layoutStyles.alignItemsCenter}>
                                    <input checked={manager.nsfwFilter}
                                           onChange={handleNSFWFilter}
                                           type="checkbox"/>{" "}
                                    <span className={switchStyles.lever} />
                                    View NSFW
                                </label>
                            </div>
                        }
                    </div>
                </div>
            }
            {
                manager.profiles.length > 0 &&
                <div>

                </div>
            }
            <main ref={gridRef}>
                <div className={postContainer}>
                    {
                        props.social.error &&
                        <div className={mT1}>
                            <Error />
                        </div>
                    }
                    {
                        !props.social.loading && !props.social.error && props.social.posts.length === 0 &&
                        <div className={mT1}>
                            <Empty body="There are no posts here. Try a different tag." />
                        </div>
                    }
                </div>
                <Masonry ref={(c) => { masonryRef.current = c; }} options={{gutter: 5}} enableResizableChildren={true} updateOnEachImageLoad={true}>
                    {posts}
                </Masonry>
                <div className={postContainer}>
                    {
                        props.social.loading && !props.social.reachedEnd &&
                        <div className={mT1}>
                            <Loading />
                        </div>
                    }
                    {
                        props.social.reachedEnd &&
                        <div className={layoutStyles.flex + ' ' + layoutStyles.flexColumn + ' ' + layoutStyles.justifyContentCenter + ' ' + layoutStyles.mT3 + ' ' + layoutStyles.mB2}>
                            <hr className={layoutStyles.wF} />
                            <p>You have reached the end!</p>
                        </div>
                    }
                </div>
            </main>
        </Container>
    );
}

const mapStateToProps = state => {
    const { auth, social } = state;
    return { auth: auth, social: social };
};

export default connect(mapStateToProps)(Search);
