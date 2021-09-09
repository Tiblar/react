// @flow

import React from "react";

import ProfileContainer from "../parts/profile/ProfileContainer";
import Social from "./Social";

import {ProfileProvider} from "../parts/profile/context";
import Theme from "../parts/profile/theme";

function SocialProfile(props) {
    let routeName = null;

    switch(props.location.pathname){
        case "/" + props.match.params.username:
            routeName = "profile";
            break;
        case "/" + props.match.params.username + "/following":
            routeName = "following";
            break;
        case "/" + props.match.params.username + "/followers":
            routeName = "followers";
            break;
        case "/" + props.match.params.username + "/likes":
            routeName = "likes";
            break;
        case "/" + props.match.params.username + "/about":
            routeName = "about";
            break;
    }

    return (
        <Social>
            <ProfileProvider>
                <Theme />
                <ProfileContainer username={props.match.params.username} routeName={routeName}>
                    {props.children}
                </ProfileContainer>
            </ProfileProvider>
        </Social>
    );
}

export default SocialProfile;
