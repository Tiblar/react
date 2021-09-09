// @flow

import React from "react";

import ProfileContainer from "../parts/profile/ProfileContainer";
import Video from "./Video";

import {ProfileProvider} from "../parts/profile/context";
import Theme from "../parts/profile/theme";

function VideoProfile(props) {
    let routeName = null;

    switch(props.location.pathname){
        case "/channel/" + props.match.params.username:
            routeName = "profile";
            break;
        case "/channel/" + props.match.params.username + "/following":
            routeName = "following";
            break;
        case "/channel/" + props.match.params.username + "/followers":
            routeName = "followers";
            break;
        case "/channel/" + props.match.params.username + "/likes":
            routeName = "likes";
            break;
        case "/channel/" + props.match.params.username + "/about":
            routeName = "about";
            break;
    }

    return (
        <Video>
            <ProfileProvider>
                <Theme />
                <ProfileContainer username={props.match.params.username} routeName={routeName} video={true}>
                    {props.children}
                </ProfileContainer>
            </ProfileProvider>
        </Video>
    );
}

export default VideoProfile;
