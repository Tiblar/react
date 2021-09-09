// @flow

import React, {useEffect, useRef, useState} from "react";
import {connect} from "react-redux";
import axios from "axios";

import previewStyles from "../../../../../css/components/profile-preview.css";
import formStyles from "../../../../../css/form.css";
import layoutStyles, {mT1} from "../../../../../css/layout.css";

import CloseIcon from "../../../../../assets/svg/icons/arrowLeft.svg";

import Loading from "../social/feed/components/Loading";
import DefaultPost from "../social/post/DefaultPost";
import Header from "./preview/Header";

import Error from "../social/feed/components/Error";
import NotFound from "../social/feed/components/NotFound";
import LoginBlocked from "../profile/default/LoginBlocked";
import FollowBlocked from "../profile/default/FollowBlocked";

import {
    API_URL,
    BOTTOM_LOAD_HEIGHT,
    ERROR_BLOCKED_BY,
    ERROR_VIEW_FOLLOW,
    ERROR_VIEW_LOGIN
} from "../../../../../util/constants";
import outsideClick from "../../../../../util/components/outsideClick";
import store from "../../../../../store";
import {
    addPreviewPosts,
    previewPosts,
    previewShow,
    previewUser,
    previewUserId
} from "../../../../../reducers/social/actions";
import history from "../../../../../util/history";
import ContentLoader from "../../../../../util/components/ContentLoader";

function PreviewProfile(props) {
    const [manager, setManager] = useState({
        loading: false,
        reachedEnd: false,
        error: false,
        offset: 0,
        blocked: false,
        view: {
            login: false,
            follow: false,
        },
        notFound: false,
    });

    const containerRef = useRef();
    const profileRef = useRef();

    const UsernameLoader = (props) => (
        <ContentLoader
            style={{backgroundColor: "var(--loader-background)"}}
            speed={2}
            width={100}
            height={20}
            viewBox="0 0 100 20"
        >
            <rect x="0" y="0" width="100" height="100" />
        </ContentLoader>
    )

    useEffect(() => {
        return history.listen((location) => {
            handleClose();
        })
    },[history])

    useEffect(() => {
        fetchProfile();
    }, []);

    useEffect(() => {
        if(manager.loading && !manager.reachedEnd){
            fetch();
        }
    }, [manager.loading]);

    useEffect(() => {
        if(manager.error){
            containerRef.current.scrollTop = 0;
        }
    }, [manager.error])

    useEffect(() => {
        containerRef.current.addEventListener('scroll', trackScroll);

        return () => {
            containerRef.current.removeEventListener('scroll', trackScroll);
        };
    }, [props.social.loading, props.social.reachedEnd, props.social.error]);

    const trackScroll = (e) => {
        if(
            (e.target.scrollHeight - e.target.scrollTop - e.target.offsetHeight < BOTTOM_LOAD_HEIGHT
                && !manager.loading && !manager.reachedEnd && !manager.error)
        ) {
            setManager(manager => ({
                ...manager,
                loading: true,
            }))
        }
    };

    function handleClose() {
        store.dispatch(previewShow(false));
        store.dispatch(previewUser(null));
        store.dispatch(previewUserId(null));
        store.dispatch(previewPosts([]));
    }

    function handleVisitProfile() {
        if(props.social.previewProfile.user === null) return;

        handleClose();
        window.open(`/${props.social.previewProfile.user.info.username}`, "_blank")
    }

    outsideClick(profileRef, handleClose);

    function fetchProfile() {
        const config = {
            headers: {
                "Content-Type": "application/json",
            }
        };

        axios.get(API_URL + `/users/profile/${props.social.previewProfile.userId}`, config)
            .then(res => {
                if(res.data.data.user !== undefined){
                    store.dispatch(previewUser(res.data.data.user));

                    setManager(manager => ({
                        ...manager,
                        loading: true,
                    }));
                }
            })
            .catch(err => {
                if(err.response.status === 404){
                    setManager(manager => ({
                        ...manager,
                        error: true,
                        notFound: true,
                    }));
                }else if(err.response.status === 403){
                    if(err.response.data.errors.auth === ERROR_BLOCKED_BY){
                        setManager(manager => ({
                            ...manager,
                            error: true,
                            blocked: true,
                        }));
                    }

                    if(err.response.data.errors.auth === ERROR_VIEW_LOGIN){
                        setManager(manager => ({
                            ...manager,
                            view: {
                                ...manager.view,
                                login: true,
                            },
                            error: true,
                        }));
                    }

                    if(err.response.data.errors.auth === ERROR_VIEW_FOLLOW){
                        setManager(manager => ({
                            ...manager,
                            view: {
                                ...manager.view,
                                follow: true,
                            },
                            error: true,
                        }));
                    }
                }else{
                    setManager(manager => ({
                        ...manager,
                        error: true,
                    }));
                }
            });
    }

    function fetch() {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            params: {
                offset: manager.offset
            }
        };

        axios.get(API_URL + `/users/profile/${props.social.previewProfile.userId}/feed`, config)
            .then(res => {
                let reachedEnd = res.data.data.posts.length < 10;

                store.dispatch(addPreviewPosts(res.data.data.posts));

                setManager(manager => ({
                    ...manager,
                    loading: false,
                    offset: manager.offset + 10,
                    reachedEnd: reachedEnd
                }))
            })
            .catch(err => {
                setManager(manager => ({
                    ...manager,
                    error: true,
                }))
            });
    }

    return (
        <div className={previewStyles.containerOuter}>
            <div className={previewStyles.profileContainer} ref={profileRef}>
                <div className={previewStyles.top}>
                    <div className={previewStyles.close} onClick={handleClose}>
                        <CloseIcon height={22} />
                    </div>
                    <div className={previewStyles.username}>
                        {
                            props.social.previewProfile.user === null && !manager.error &&
                            <UsernameLoader />
                        }
                        {
                            props.social.previewProfile.user !== null && !manager.error &&
                            <h4>{props.social.previewProfile.user.info.username}</h4>
                        }
                    </div>
                    <div className={previewStyles.interactions}>
                        <button className={formStyles.button + ' ' + formStyles.buttonSuccess}
                                disabled={props.social.previewProfile.user === null}
                                onClick={handleVisitProfile}>
                            View Profile
                        </button>
                    </div>
                </div>
                <div className={previewStyles.bottom}>
                    <div className={layoutStyles.wF + ' ' + layoutStyles.positionRelative}>
                        <div className={previewStyles.container} ref={containerRef}>
                            {
                                !manager.error &&
                                <main>
                                    <Header />
                                    <div className={layoutStyles.mT1}>
                                        {props.social.previewProfile.posts.map((post) => (
                                            <DefaultPost key={post.id}
                                                         post={post}
                                                         postId={post.id}
                                                         previewProfile={true}
                                                         profileUser={props.social.previewProfile.user}/>
                                        ))}
                                        {
                                            manager.loading && !manager.reachedEnd &&
                                            <div className={mT1}>
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
                                </main>
                            }
                            {
                                manager.error && !manager.notFound &&
                                !manager.blocked && !manager.view.login && !manager.view.follow &&
                                <Error />
                            }
                            {
                                manager.error && manager.notFound &&
                                <NotFound />
                            }
                            {
                                manager.error && manager.view.login &&
                                <LoginBlocked />
                            }
                            {
                                manager.error && manager.view.follow && props.social.previewProfile.userId !== null &&
                                <FollowBlocked userId={props.social.previewProfile.userId} />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    const { auth, social } = state;
    return { auth: auth, social: social };
};

export default connect(mapStateToProps)(PreviewProfile);
