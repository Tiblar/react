// @flow

import React, { useState } from "react";
import { connect } from "react-redux";
import ReactTooltip from "react-tooltip";
import PropTypes from "prop-types";
import {isMobile} from "is-mobile";

import {
    portalWrapper,
    portalContainer,
    modal,
    portal,
    icon,
    active
} from "../../../css/layout/portal.css";
import { mT } from "../../../css/layout.css";
import {
    statusDot,
    statusDotLg,
    alertDot
} from "../../../css/components/status-dots.css";

import SocialIcon from "../../../assets/svg/icons/stream.svg";
import ChatIcon from "../../../assets/svg/icons/comments.svg";
import VideoIcon from "../../../assets/svg/icons/video.svg";

import Profile from "./parts/portal/Profile";
import Settings from "./parts/portal/Settings";
import Upgrade from "./parts/portal/Upgrade";

import { CONTAINER, useLayerDispatch } from "./layer/context";
import history from "../../../util/history";
import {updatePortal} from "../../../reducers/portal/actions";
import useWindowDimensions from "../../../util/hooks/useWindowDimensions";
import {MAX_MOBILE_WIDTH} from "../../../util/constants";

function PortalNav(props) {
    const layerDispatch = useLayerDispatch();
    const {width} = useWindowDimensions();

    async function switchPortal(route, nav) {
        setNav({
            nav: nav
        });

        await props.updatePortal(nav);
        layerDispatch({ type: CONTAINER, payload: null });
        setTimeout(() => {
            history.push(route);
        }, 100);
    }

    let loc = "SOCIAL";
    switch (history.location.pathname.split("/")[1]) {
        case "social":
            loc = "SOCIAL";
            break;
        case "chat":
            loc = "CHAT";
            break;
        case "video":
            loc = "VIDEO";
            break;
        default:
            loc = "SOCIAL";
            break;
    }

    let [nav, setNav] = useState({
        nav: loc
    });

    if(width <= MAX_MOBILE_WIDTH && !props.showMobile){
        return null;
    }

    return (
        <div className={portalWrapper + ((isMobile() && width <= MAX_MOBILE_WIDTH) ? " mobile" : "")}>
            <div className={modal} id="portal-nav-modal" />
            <div className={portalContainer}>
                <div
                    onClick={() => {
                        switchPortal(props.portal.path.social, "SOCIAL");
                    }}
                    data-tip
                    data-for="home"
                    className={props.portal.portal === "SOCIAL" ? portal + " " + active : portal}
                >
                    <SocialIcon width="24" className={icon} />
                </div>
                <ReactTooltip id="home" place="right" type="dark" effect="solid">
                    <span>Social</span>
                </ReactTooltip>
                {(props.auth.isAuthenticated && !isMobile()) && (
                    <div
                        onClick={() => {
                            switchPortal(props.portal.path.chat, "CHAT");
                        }}
                        data-tip
                        data-for="groups"
                        className={props.portal.portal === "CHAT" ? portal + " " + active : portal}
                    >
                        <ChatIcon width="24" className={icon} />
                        {props.notifications.chat.total !== 0 && (
                            <div className={statusDot + " " + statusDotLg + " " + alertDot}>
                                {props.notifications.path.chat.total}
                            </div>
                        )}
                    </div>
                )}
                <ReactTooltip id="groups" place="right" type="dark" effect="solid">
                    <span>Groups & Chat</span>
                </ReactTooltip>
                <div data-tip
                     data-for="video"
                     className={props.portal.portal === "VIDEO" ? portal + " " + active : portal}
                     onClick={() => {
                         switchPortal(props.portal.path.video, "VIDEO");
                     }}
                >
                    <VideoIcon width="24" className={icon} />
                </div>
                <ReactTooltip id="video" place="right" type="dark" effect="solid">
                    <span>Video & Stream</span>
                </ReactTooltip>
                {props.auth.isAuthenticated && <Upgrade />}
                {
                    (isMobile() && width <= MAX_MOBILE_WIDTH) &&
                    <Profile
                        user={props.auth.user}
                        isAuthenticated={props.auth.isAuthenticated}
                    />
                }
                {
                    (!isMobile() || width > MAX_MOBILE_WIDTH) &&
                    <div className={mT}>
                        {props.auth.isAuthenticated && <Settings />}
                        <Profile
                            user={props.auth.user}
                            isAuthenticated={props.auth.isAuthenticated}
                        />
                    </div>
                }
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    const { notifications, auth, portal } = state;
    return { notifications: notifications, auth: auth, portal: portal };
};

const mapDispatchToProps = dispatch => {
    return {
        updatePortal: portal => dispatch(updatePortal(portal))
    }
};

PortalNav.propTypes = {
    showMobile: PropTypes.bool
};

PortalNav.defaultProps = {
    showMobile: false
};

export default connect(mapStateToProps, mapDispatchToProps)(PortalNav);
