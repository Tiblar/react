// @flow

import React, {useState} from "react";
import {connect} from "react-redux";
import {toast} from "react-toastify";

import previewStyles from "../../../../../../css/components/profile-preview.css";
import layoutStyles, {mL} from "../../../../../../css/layout.css";
import {hide} from "../../../../../../css/layout.css";
import navStyles from "../../../../../../css/components/tabs-nav.css";

import LocationIcon from "../../../../../../assets/svg/icons/map-marker.svg";
import profileStyles from "../../../../../../css/layout/social/profile.css";
import {Link} from "react-router-dom";
import formStyles from "../../../../../../css/form.css";
import axios from "axios";
import {API_URL, MAX_MOBILE_WIDTH} from "../../../../../../util/constants";
import ContentLoader from "../../../../../../util/components/ContentLoader";
import useWindowDimensions from "../../../../../../util/hooks/useWindowDimensions";

function PreviewProfile(props) {
    const [manager, setManager] = useState({
        avatarLoaded: false,
        followed: false,
        unfollowed: false,
        bannerLoaded: false,
    });

    const {width} = useWindowDimensions();
    let bannerWidth = width;

    if(bannerWidth > MAX_MOBILE_WIDTH){
        bannerWidth = 525;
    }

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
            height={bannerWidth/(3.5)}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
        >
            <rect x="0" y="0" width="100%" height="100" />
        </ContentLoader>
    )

    function handleFollow() {
        if(!props.auth.isAuthenticated || props.social.previewProfile.user.id === props.auth.user.id) return;

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        axios
            .post(API_URL + "/users/follow/" + props.social.previewProfile.user.id, {}, config)
            .then(res => {
                props.social.previewProfile.user.info.following = true;

                setManager(manager => ({
                    ...manager,
                    followed: true,
                    unfollowed: false,
                }));
            })
            .catch(err => {
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

    function handleUnfollow() {
        if(!props.auth.isAuthenticated || props.social.previewProfile.user.id === props.auth.user.id) return;

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        axios
            .delete(API_URL + "/users/follow/" + props.social.previewProfile.user.id, config)
            .then(res => {
                props.social.previewProfile.user.info.following = false;

                setManager(manager => ({
                    ...manager,
                    unfollowed: true,
                    followed: false,
                }));
            })
            .catch(err => {
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

    if(props.social.previewProfile.user === null){
        return (
            <div className={profileStyles.header}>
                <div className={profileStyles.cover}>
                </div>
            </div>
        );
    }

    let bannerStyles = {};
    if(props.social.previewProfile.user.info.banner === null){
        bannerStyles = {
            height: "150px"
        }
    }

    return (
        <header className={layoutStyles.wF}>
            <div className={previewStyles.header}>
                <div className={previewStyles.cover} style={bannerStyles}>
                    {
                        <img src={props.social.previewProfile.user.info.banner}
                             style={{ width: bannerWidth + "px", height: (bannerWidth/3.5) + "px" }}
                             onLoad={() => {
                                 setManager({...manager, bannerLoaded: true})
                             }}
                             className={!manager.bannerLoaded ? hide : ''} alt="profile banner"/>
                    }
                    {
                        props.social.previewProfile.user.info.banner !== null && !manager.bannerLoaded && <BannerLoader />
                    }
                    <div className={previewStyles.profileImage}>
                        {
                            !manager.avatarLoaded && <ProfileLoader />
                        }
                        <img src={props.social.previewProfile.user.info.avatar}
                             onLoad={() => { setManager({ ...manager, avatarLoaded: true }) }}
                             className={!manager.avatarLoaded ? hide : ''} alt="header" />
                    </div>
                </div>
                <div className={previewStyles.main}>
                    <div className={previewStyles.info}>
                        <div className={previewStyles.username}>
                            <h3>{props.social.previewProfile.user.info.username}</h3>
                            {
                                props.social.previewProfile.user.info.followed_by && <label>Follows you</label>
                            }
                            {
                                props.social.previewProfile.user.info.blocking && <label>Blocked</label>
                            }
                        </div>
                        {
                            props.social.previewProfile.user.info.location !== null &&
                            <div className={previewStyles.location}>
                                <LocationIcon height={16} />
                                <span>{props.social.previewProfile.user.info.location}</span>
                            </div>
                        }
                        {
                            props.social.previewProfile.user.info.biography !== null &&
                            <div className={previewStyles.biography}>
                                <span>{props.social.previewProfile.user.info.biography}</span>
                            </div>
                        }
                    </div>
                </div>
                <div className={navStyles.nav}>
                    <div className={navStyles.pages}>
                        <div className={navStyles.page}>
                            <label>
                                Feed
                            </label>
                            <span className={navStyles.active}/>
                        </div>
                        <div className={mL + ' ' + profileStyles.follow}>
                            {
                                !props.auth.isAuthenticated &&
                                <Link to={`/login`}
                                      className={formStyles.button + ' ' + formStyles.buttonPrimary}>
                                    Follow
                                </Link>
                            }
                            {
                                ((props.auth.isAuthenticated && !props.social.previewProfile.user.info.following && !manager.followed) || manager.unfollowed) &&
                                <button disabled={props.social.previewProfile.user.id === props.auth.user.id || props.social.previewProfile.user.info.blocking}
                                        onClick={handleFollow}
                                        className={formStyles.button + ' ' + formStyles.buttonPrimary}>
                                    Follow
                                </button>
                            }
                            {
                                ((props.auth.isAuthenticated && props.social.previewProfile.user.info.following && !manager.unfollowed) || manager.followed) &&
                                <button disabled={props.social.previewProfile.user.id === props.auth.user.id}
                                        onClick={handleUnfollow}
                                        className={formStyles.button + ' ' + formStyles.buttonPrimaryOutline}>
                                    Unfollow
                                </button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

const mapStateToProps = state => {
    const { auth, social } = state;
    return { auth: auth, social: social };
};

export default connect(mapStateToProps)(PreviewProfile);
