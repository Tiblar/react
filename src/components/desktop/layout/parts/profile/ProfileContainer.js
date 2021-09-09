// @flow

import React, {useEffect, useRef, useState} from "react";
import {connect} from "react-redux";
import axios from "axios";
import PropTypes from "prop-types";

import {flex, contentWrapper, wF, positionRelative} from "../../../../../css/layout.css";
import mainStyles from "../../../../../css/layout/main.css";
import {postContainer} from "../../../../../css/layout/social/container/main.css";
import {container} from "../../../../../css/layout/social/container/main.css";
import outrunStyles from "../../../../../css/themes/outrun-theme.css";
import cyberpunkStyles from "../../../../../css/themes/cyberpunk-theme.css";
import cozyStyles from "../../../../../css/themes/cozy-theme.css";
import skeletonStyles from "../../../../../css/themes/skeleton-theme.css";
import cloverStyles from "../../../../../css/themes/clover-theme.css";

import Cover from "../../../../../assets/graphics/social/cover.svg";

import ProfileNav from "../social/nav/right/ProfileNav";
import ProfileTopNav from "../social/nav/top/ProfileTopNav";
import HomeNav from "../social/nav/left/HomeNav";
import VideoHomeNav from "../video/nav/left/HomeNav";
import NotFound from "../social/feed/components/NotFound";
import Error from "../social/feed/components/Error";
import Header from "./default/Header";
import Blocked from "./default/Blocked";
import FollowBlocked from "./default/FollowBlocked";
import LoginBlocked from "./default/LoginBlocked";
import Banned from "./default/Banned";

import {
    API_URL, CLOVER_THEME, COZY_THEME, CYBERPUNK_THEME, DARK_THEME,
    ERROR_BLOCKED_BY,
    ERROR_VIEW_FOLLOW,
    ERROR_BANNED,
    ERROR_VIEW_LOGIN, LIGHT_THEME, MAX_MOBILE_WIDTH,
    OUTRUN_THEME, SKELETON_THEME
} from "../../../../../util/constants";
import {UPDATE_CONTAINER, UPDATE_USER, useProfileDispatch, useProfileState} from "./context";
import useWindowDimensions from "../../../../../util/hooks/useWindowDimensions";

function ProfileContainer(props) {
    const profileDispatch = useProfileDispatch();
    const {user} = useProfileState();
    const {width} = useWindowDimensions();

    const containerRef = useRef();

    const [manager, setManager] = useState({
        notFound: false,
        blocked: false,
        banned: false,
        view: {
            login: false,
            follow: false,
        },
        error: false,
    });

    useEffect(() => {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        setManager(manager => ({
            ...manager,
            notFound: false,
            blocked: false,
            view: {
                login: false,
                follow: false,
            },
            error: false,
        }))

        axios.get(API_URL + '/users/profile/' + props.username, config)
            .then(function (res) {
                if(res.data.data.user){
                    profileDispatch({ type: UPDATE_USER, payload: res.data.data.user });
                }
            })
            .catch(function (err) {
                if(err.response.status === 404){
                    setManager(manager => ({
                        ...manager,
                        notFound: true,
                    }));
                }else if(err.response.status === 403){
                    if(err.response.data.errors.auth === ERROR_BLOCKED_BY){
                        setManager(manager => ({
                            ...manager,
                            blocked: true,
                        }));
                    }

                    if(err.response.data.errors.auth === ERROR_VIEW_LOGIN){
                        setManager(manager => ({
                            ...manager,
                            view: {
                                ...manager.view,
                                login: true,
                            }
                        }));
                    }

                    if(err.response.data.errors.auth === ERROR_VIEW_FOLLOW){
                        setManager(manager => ({
                            ...manager,
                            view: {
                                ...manager.view,
                                follow: true,
                            }
                        }));
                    }

                    if(err.response.data.errors.banned === ERROR_BANNED){
                        setManager(manager => ({
                            ...manager,
                            banned: true,
                        }));
                    }
                }else{
                    setManager(manager => ({
                        ...manager,
                        error: true,
                    }));
                }
            });
    }, [props.username]);


    useEffect(() => {
        if(props.social.error){
            containerRef.current.scrollTop = 0;
        }
    }, [props.social.error])

    useEffect(() => {
        // For scrollbar
        profileDispatch({ type: UPDATE_CONTAINER, payload: containerRef });
    }, [containerRef.current])

    function themeBackground() {
        if(user === null){
            return "";
        }

        if(user.info.profile_theme === OUTRUN_THEME){
            return ' ' + outrunStyles.background;
        }

        if(user.info.profile_theme === CYBERPUNK_THEME){
            return ' ' + cyberpunkStyles.background;
        }

        if(user.info.profile_theme === COZY_THEME){
            return ' ' + cozyStyles.background;
        }

        if(user.info.profile_theme === SKELETON_THEME){
            return ' ' + skeletonStyles.background;
        }

        if(user.info.profile_theme === CLOVER_THEME){
            return ' ' + cloverStyles.background;
        }

        return "";
    }

    let theme = user !== null ? user.info.profile_theme : null;

    if(width > MAX_MOBILE_WIDTH) {
        return (
            <div className={contentWrapper + themeBackground()}>
                {
                    props.video && <VideoHomeNav theme={theme} />
                }
                {
                    !props.video && <HomeNav theme={theme}/>
                }
                <div className={mainStyles.container}>
                    <div className={mainStyles.wrapper}>
                        <ProfileTopNav username={props.username} video={props.video} theme={theme} />
                        <div className={flex + " " + mainStyles.container}>
                            {
                                ([null, LIGHT_THEME, DARK_THEME].includes(theme) && !props.video) &&
                                <div className={mainStyles.cover}>
                                    <Cover/>
                                </div>
                            }
                            <div className={mainStyles.bottomContent}>
                                <div className={wF + ' ' + positionRelative}>
                                    <div className={container} ref={containerRef}>
                                        {
                                            !manager.error && !manager.notFound && !manager.banned && !manager.blocked && !manager.view.login && !manager.view.follow &&
                                            <Header username={props.username} routeName={props.routeName} video={props.video} />
                                        }
                                        {
                                            !manager.error && !manager.notFound && !manager.banned && !manager.blocked && !manager.view.login && !manager.view.follow &&
                                            props.children
                                        }
                                        {
                                            manager.notFound && !manager.error && !manager.banned && !manager.blocked && !manager.view.login && !manager.view.follow &&
                                            <div className={postContainer}>
                                                <NotFound/>
                                            </div>
                                        }
                                        {
                                            manager.blocked && !manager.error && !manager.banned && !manager.notFound && !manager.view.login && !manager.view.follow &&
                                            <div className={postContainer}>
                                                <Blocked/>
                                            </div>
                                        }
                                        {
                                            manager.view.follow && !manager.error && !manager.banned && !manager.notFound && !manager.view.login && !manager.blocked &&
                                            <div className={postContainer}>
                                                <FollowBlocked username={props.username}/>
                                            </div>
                                        }
                                        {
                                            manager.view.login && !manager.error && !manager.banned && !manager.notFound && !manager.view.follow && !manager.blocked &&
                                            <div className={postContainer}>
                                                <LoginBlocked/>
                                            </div>
                                        }
                                        {
                                            manager.banned &&
                                            <div className={postContainer}>
                                                <Banned />
                                            </div>
                                        }
                                        {
                                            manager.error &&
                                            <div className={postContainer}>
                                                <Error/>
                                            </div>
                                        }
                                    </div>
                                </div>
                                <ProfileNav/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={contentWrapper + themeBackground()}>
            <div className={mainStyles.container}>
                <div className={mainStyles.wrapper}>
                    <ProfileTopNav theme={theme} username={props.username}/>
                    <div className={flex + " " + mainStyles.container}>
                        {
                            ([null, LIGHT_THEME, DARK_THEME].includes(theme) && !props.video) &&
                            <div className={mainStyles.cover}>
                                <Cover/>
                            </div>
                        }
                        <div className={mainStyles.bottomContent}>
                            <div className={wF + ' ' + positionRelative}>
                                <div className={container} ref={containerRef}>
                                    {
                                        !manager.error && !manager.notFound && !manager.blocked && !manager.view.login && !manager.view.follow &&
                                        <Header username={props.username} routeName={props.routeName}  video={props.video}/>
                                    }
                                    {
                                        !manager.error && !manager.notFound && !manager.blocked && !manager.view.login && !manager.view.follow &&
                                        props.children
                                    }
                                    {
                                        manager.notFound && !manager.error && !manager.blocked && !manager.view.login && !manager.view.follow &&
                                        <div className={postContainer}>
                                            <NotFound/>
                                        </div>
                                    }
                                    {
                                        manager.blocked && !manager.error && !manager.notFound && !manager.view.login && !manager.view.follow &&
                                        <div className={postContainer}>
                                            <Blocked/>
                                        </div>
                                    }
                                    {
                                        manager.view.follow && !manager.error && !manager.notFound && !manager.view.login && !manager.blocked &&
                                        <div className={postContainer}>
                                            <FollowBlocked username={props.username}/>
                                        </div>
                                    }
                                    {
                                        manager.view.login && !manager.error && !manager.notFound && !manager.view.follow && !manager.blocked &&
                                        <div className={postContainer}>
                                            <LoginBlocked/>
                                        </div>
                                    }
                                    {
                                        manager.error &&
                                        <div className={postContainer}>
                                            <Error/>
                                        </div>
                                    }
                                </div>
                            </div>
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

ProfileContainer.propTypes = {
    username: PropTypes.string.isRequired,
    routeName: PropTypes.string.isRequired,
    video: PropTypes.bool,
}

ProfileContainer.defaultProps = {
    video: false,
}

export default connect(mapStateToProps)(ProfileContainer);
