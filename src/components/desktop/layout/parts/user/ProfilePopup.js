// @flow

import React, {useState} from "react";
import {connect} from "react-redux";

import profileStyles from "../../../../../css/components/pp.css";

import ProfilePicture from "./ProfilePicture";
import {hide} from "../../../../../css/layout.css";

import ContentLoader from "../../../../../util/components/ContentLoader";

function ProfilePopup(props) {

    const [manager, setManager] = useState({
        bannerLoaded: false,
    });

    const BannerLoader = () => (
        <ContentLoader
            speed={2}
            width="100%"
            height={100}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
        >
            <rect x="0" y="0" width="100%" height="100" />
        </ContentLoader>
    )

    return (
        <div className={profileStyles.popup + ' ' + (props.hide ? profileStyles.hide : '')}>
            <div className={profileStyles.header}>
                <div className={profileStyles.cover}>
                    {
                        props.user.info.banner !== null &&
                        <img src={props.user.info.banner}
                             onLoad={() => { setManager({ ...manager, bannerLoaded: true }) }}
                             className={!manager.bannerLoaded ? hide : ''} alt="profile banner" />
                    }
                    {
                        props.user.info.banner !== null && !manager.bannerLoaded && <BannerLoader />
                    }
                    <div className={profileStyles.profileImage}>
                        <ProfilePicture user={props.user} />
                    </div>
                </div>
                <div className={profileStyles.main}>
                    <div className={profileStyles.user}>
                        <h3>{props.user.info.username}</h3>
                        <div className={profileStyles.follow}>
                            {
                                props.user.info.followed_by &&
                                <label>Follows you</label>
                            }
                        </div>
                    </div>
                    {
                        props.user.info.biography !== null && props.user.info.biography.length > 0 &&
                        <p>
                            {props.user.info.biography}
                        </p>
                    }
                    {
                        props.user.info.follower_count &&
                        <div className={profileStyles.stats}>
                            <div>
                                <p><span>{props.user.info.follower_count}</span> followers</p>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth };
};

export default connect(mapStateToProps)(ProfilePopup);
