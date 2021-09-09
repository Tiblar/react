// @flow

import React, {useRef, useState} from "react";
import {connect} from "react-redux";
import axios from "axios";
import {toast} from "react-toastify";
import {isMobile} from "is-mobile";

import layoutStyles, {mL, hide} from "../../../../../../css/layout.css";
import navStyles from "../../../../../../css/components/tabs-nav.css";
import profileStyles from "../../../../../../css/layout/social/profile.css";
import actionStyles from "../../../../../../css/components/action-menu.css";
import outrunStyles from "../../../../../../css/themes/outrun-theme.css";
import cyberpunkStyles from "../../../../../../css/themes/cyberpunk-theme.css";
import newspaperStyles from "../../../../../../css/themes/newspaper-theme.css";
import mobileOptionsStyles from "../../../../../../css/components/mobile-options.css";

import LocationIcon from "../../../../../../assets/svg/icons/map-marker.svg";
import EllipsisIcon from "../../../../../../assets/svg/icons/ellipsisH.svg";
import GearIcon from "../../../../../../assets/svg/icons/gear.svg";
import LockIcon from "../../../../../../assets/svg/icons/lock.svg";

import ChangeHeader from "./ChangeHeader";
import FollowButton from "./FollowButton";

import {UPDATE_USER, useProfileDispatch, useProfileState} from "../context";
import history from "../../../../../../util/history";
import {
    API_URL,
    CYBERPUNK_THEME,
    MAX_MOBILE_WIDTH,
    NEWSPAPER_THEME,
    OUTRUN_THEME
} from "../../../../../../util/constants";
import outsideClick from "../../../../../../util/components/outsideClick";
import {numberToString} from "../../../../../../util/formatNumber";
import ContentLoader from "../../../../../../util/components/ContentLoader";
import useWindowDimensions from "../../../../../../util/hooks/useWindowDimensions";

function ProfileContainer(props) {
    const { user } = useProfileState();
    const profileDispatch = useProfileDispatch();
    const optionsRef = useRef();
    const { width } = useWindowDimensions();

    let bannerWidth = width;
    let bannerHeight = 200;

    if(width > MAX_MOBILE_WIDTH){
        bannerWidth = props.video ? 900 : 700;
    }

    const [manager, setManager] = useState({
        avatarLoaded: false,
        bannerLoaded: false,
        showOptions: false,
    });

    const ProfileLoader = () => (
        <ContentLoader
            speed={2}
            width={100}
            height={100}
            viewBox="0 0 100 100"
        >
            <rect x="0" y="0" width="100" height="100" />
        </ContentLoader>
    )

    const BannerLoader = () => (
        <ContentLoader
            speed={2}
            width={bannerWidth}
            height={bannerHeight}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
        >
            <rect x="0" y="0" rx="1" width="100%" height="100" />
        </ContentLoader>
    )

    outsideClick(optionsRef, () => {
        if(manager.showOptions){
            setManager(manager => ({
                ...manager,
                showOptions: false,
            }));
        }
    })

    function handleBlock()
    {
        if(!props.auth.isAuthenticated || user.id === props.auth.user.id) return;

        axios({
            method: user.info.blocking ? 'delete' : 'post',
            url: API_URL + "/users/block/" + user.id,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            setManager(manager => ({
                ...manager,
                showOptions: false,
            }));

            let status = user.info.blocking ? "Unblocked" : "Blocked";

            const Notification = () => (
                <div>
                    {status} user!
                </div>
            );

            setTimeout(() => {
                toast(<Notification />, {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }, 800);

            user.info.blocking = !user.info.blocking;
            user.info.followed_by = false;
            user.info.following = false;
            profileDispatch({ type: UPDATE_USER, payload: user });
        }).catch(err => {
            const Notification = () => (
                <div>
                    There was an error!
                </div>
            );

            setTimeout(() => {
                toast.error(<Notification />, {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }, 800);
        });
    }

    function usernameTheme() {
        if(user === null){
            return "";
        }

        if(user.info.profile_theme === OUTRUN_THEME){
            return ' ' + outrunStyles.username;
        }

        if(user.info.profile_theme === CYBERPUNK_THEME){
            return ' ' + cyberpunkStyles.username;
        }

        if(user.info.profile_theme === NEWSPAPER_THEME){
            return ' ' + newspaperStyles.username;
        }

        return "";
    }

    if(user === null){
        return (
            <div className={profileStyles.header}>
                <div className={profileStyles.cover}>
                    <BannerLoader />
                    <div className={profileStyles.profileImage}>
                        <ProfileLoader />
                    </div>
                </div>
                <div className={profileStyles.main}>
                    <div className={profileStyles.info} />
                </div>
            </div>
        );
    }

    // Set banner to redux value for if update
    if(props.auth.isAuthenticated && props.auth.user !== null && props.auth.user.id === user.id){
        user.info.banner = props.auth.user.info.banner;
    }

    let bannerStyles = {};
    if(user.info.banner === null){
        bannerStyles = {
            height: "200px"
        }
    }

    return (
        <div className={profileStyles.header + (props.video ? ' ' + profileStyles.videoHeader : '')}>
            <div className={profileStyles.cover} style={bannerStyles}>
                {
                    user.info.banner !== null &&
                    <img src={user.info.banner}
                         onLoad={() => {
                             setManager({...manager, bannerLoaded: true})
                         }}
                         className={!manager.bannerLoaded ? hide : ''} alt="profile banner"/>
                }
                {
                    (!manager.bannerLoaded && user.info.banner !== null) && <BannerLoader />
                }
                <div className={profileStyles.profileImage}>
                    {
                        !manager.avatarLoaded && <ProfileLoader />
                    }
                    <img src={user.info.avatar}
                         onLoad={() => { setManager({ ...manager, avatarLoaded: true }) }}
                         className={!manager.avatarLoaded ? hide : ''} alt="header" />
                </div>
                {
                    props.auth.user !== null && props.auth.user.info.username === user.info.username &&
                    <ChangeHeader />
                }
            </div>
            <div className={profileStyles.main}>
                <div className={profileStyles.info}>
                    <div className={profileStyles.username}>
                        <h3 className={usernameTheme()}>{props.username}</h3>
                        {
                            props.auth.user !== null && props.auth.user.info.username !== user.info.username &&
                            <div className={profileStyles.actions}>
                                <EllipsisIcon height={16}
                                              onClick={() => {
                                                  setManager({
                                                      ...manager, showOptions: true
                                                  })}
                                              }/>
                                {
                                    (manager.showOptions && !isMobile()) &&
                                    <div className={actionStyles.actionsMenu} ref={optionsRef}>
                                        <div className={actionStyles.title}>
                                            <GearIcon height={16} />
                                            <p>Options</p>
                                        </div>
                                        {
                                            !user.info.blocking &&
                                            <div className={actionStyles.option} onClick={handleBlock}>
                                                Block
                                            </div>
                                        }
                                        {
                                            user.info.blocking &&
                                            <div className={actionStyles.option} onClick={handleBlock}>
                                                Unblock
                                            </div>
                                        }
                                        <div className={actionStyles.option}>
                                            Report
                                        </div>
                                    </div>
                                }
                                {
                                    (manager.showOptions && isMobile()) &&
                                    <div className={mobileOptionsStyles.container} onClick={() => {
                                        setManager({
                                            ...manager, showOptions: false
                                        })}
                                    }>
                                        <div className={mobileOptionsStyles.options}>
                                            <div className={mobileOptionsStyles.optionGroup}>
                                                {
                                                    !user.info.blocking &&
                                                    <div className={mobileOptionsStyles.option} onClick={handleBlock}>
                                                        Block
                                                    </div>
                                                }
                                                {
                                                    user.info.blocking &&
                                                    <div className={mobileOptionsStyles.option} onClick={handleBlock}>
                                                        Unblock
                                                    </div>
                                                }
                                                <div className={mobileOptionsStyles.option}>
                                                    Report
                                                </div>
                                            </div>
                                            <div className={mobileOptionsStyles.optionGroup}>
                                                <div className={mobileOptionsStyles.option}>
                                                    <p>Cancel</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        }
                        {
                            user.info.followed_by && <label>Follows you</label>
                        }
                        {
                            user.info.blocking && <label>Blocked</label>
                        }
                    </div>
                    {
                        user.info.location !== null &&
                        <div className={profileStyles.location}>
                            <LocationIcon height={16} />
                            <span>{user.info.location}</span>
                        </div>
                    }
                    {
                        user.info.biography !== null &&
                        <div className={profileStyles.biography}>
                            <span>{user.info.biography}</span>
                        </div>
                    }
                    {
                        width <= MAX_MOBILE_WIDTH &&
                        <div className={layoutStyles.flex + ' ' + layoutStyles.flexColumn + ' ' + layoutStyles.mT1 + ' ' + layoutStyles.mB1}>
                            <FollowButton
                                user={user}
                                followCallback={() => {
                                    user.info.following = true;
                                    profileDispatch({ type: UPDATE_USER, payload: user });
                                }}
                                unfollowCallback={() => {
                                    user.info.following = false;
                                    profileDispatch({ type: UPDATE_USER, payload: user });
                                }}
                            />
                        </div>
                    }
                </div>
            </div>
            <div className={navStyles.nav + ' ' + layoutStyles.border0}>
                <div className={navStyles.pages}>
                    {
                        props.video === true &&
                        <div onClick={() => { history.push(`/channel/${props.username}`) }}
                             className={navStyles.page}>
                            <label>
                                Videos
                            </label>
                            {
                                (props.routeName === "profile") &&
                                <span className={navStyles.active}/>
                            }
                        </div>
                    }
                    {
                        !props.video &&
                        <div onClick={() => { history.push(`/${props.username}`) }}
                             className={navStyles.page}>
                            <label>
                                Feed
                            </label>
                            {
                                (props.routeName === "profile") &&
                                <span className={navStyles.active}/>
                            }
                        </div>
                    }
                    {
                        (user.privacy.following === true || (props.auth.isAuthenticated && user.id === props.auth.user.id)) &&
                        <div onClick={() => { history.push(`${props.video === true ? '/channel' : ''}/${props.username}/following`) }}
                             className={navStyles.page}>
                            <label>
                                {user.privacy.following === false && <LockIcon height={14} />}Following
                            </label>
                            {
                                (props.routeName === "following") &&
                                <span className={navStyles.active}/>
                            }
                        </div>
                    }
                    <div onClick={() => { history.push(`${props.video === true ? '/channel' : ''}/${props.username}/followers`) }}
                         className={navStyles.page}>
                        {
                            user.privacy.follower_count === true && (!props.auth.isAuthenticated || user.id !== props.auth.user.id) &&
                            <label>
                                {numberToString(user.info.follower_count)} Follower{user.info.follower_count !== 1 ? "s" : ""}
                            </label>
                        }
                        {
                            user.privacy.follower_count === false && (!props.auth.isAuthenticated || user.id !== props.auth.user.id) &&
                            <label>
                                Followers
                            </label>
                        }
                        {
                            (props.auth.isAuthenticated && user.id === props.auth.user.id) &&
                            <label>
                                {numberToString(props.auth.user.info.follower_count)} Follower{props.auth.user.info.follower_count !== 1 ? "s" : ""}
                            </label>
                        }
                        {
                            (props.routeName === "followers") &&
                            <span className={navStyles.active}/>
                        }
                    </div>
                    {
                        (user.privacy.likes === true || (props.auth.isAuthenticated && user.id === props.auth.user.id)) &&
                        <div onClick={() => { history.push(`${props.video === true ? '/channel' : ''}/${props.username}/likes`) }}
                             className={navStyles.page}>
                            <label>
                                {user.privacy.following === false && <LockIcon height={14} />}Likes
                            </label>
                            {
                                (props.routeName === "likes") &&
                                <span className={navStyles.active}/>
                            }
                        </div>
                    }
                    <div onClick={() => { history.push(`${props.video === true ? '/channel' : ''}/${props.username}/about`) }}
                         className={navStyles.page}>
                        <label>
                            About
                        </label>
                        {
                            (props.routeName === "about") &&
                            <span className={navStyles.active}/>
                        }
                    </div>
                    <div className={mL + ' ' + profileStyles.follow}>
                        {
                            width > MAX_MOBILE_WIDTH &&
                            <FollowButton
                                user={user}
                                followCallback={() => {
                                    user.info.following = true;
                                    profileDispatch({ type: UPDATE_USER, payload: user });
                                }}
                                unfollowCallback={() => {
                                    user.info.following = false;
                                    profileDispatch({ type: UPDATE_USER, payload: user });
                                }}
                            />
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth };
};

export default connect(mapStateToProps)(ProfileContainer);
