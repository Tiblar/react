// @flow

import React from "react";
import { connect } from "react-redux";

import HomeIcon from "../../../../../../../assets/svg/icons/home.svg";
import HistoryIcon from "../../../../../../../assets/svg/icons/history.svg";
import UsersIcon from "../../../../../../../assets/svg/icons/users.svg";
import ListIcon from "../../../../../../../assets/svg/icons/list-alt.svg";
import BroadcastIcon from "../../../../../../../assets/svg/icons/broadcast.svg";
import TrendingIcon from "../../../../../../../assets/svg/icons/rocket.svg";
import NewestIcon from "../../../../../../../assets/svg/icons/clock.svg";

import {SidebarProvider} from "../../../sidebar/context";
import Sidebar from "../../../sidebar/Sidebar";
import SidebarLogo from "../../../sidebar/SidebarLogo";
import SidebarFooter from "../../../sidebar/SidebarFooter";
import SidebarContent from "../../../sidebar/SidebarContent";
import SidebarTitle from "../../../sidebar/SidebarTitle";
import SidebarLink from "../../../sidebar/SidebarLink";
import SidebarNotifications from "../../../sidebar/SidebarNotifications";
import SidebarUnauthenticated from "../../../sidebar/SidebarUnauthenticated";

import layoutStyles from "../../../../../../../css/layout.css";

import useWindowDimensions from "../../../../../../../util/hooks/useWindowDimensions";
import SidebarPostButton from "../../../sidebar/SidebarPostButton";

function HomeNav(props) {
    const {width} = useWindowDimensions();

    let username = props.auth.user !== null ? props.auth.user.info.username : null;
    let baseUrl = "/channel/" + username;

    return (
        <SidebarProvider>
            <Sidebar>
                {
                    width > 900 &&
                    <SidebarLogo redirect="/video" theme={props.theme} />
                }
                <div>
                    <SidebarContent>
                        <SidebarTitle>CONTENT</SidebarTitle>
                        <SidebarLink
                            to="/video"
                            icon={<HomeIcon width="100%" height="100%" />}
                            text="Home"
                            paths={['/video']}
                        />
                        <SidebarLink
                            to="/video/trending"
                            icon={<TrendingIcon width="100%" height="100%" />}
                            text="Trending"
                            paths={['/video/trending']}
                        />
                        <SidebarLink
                            to="/video/newest"
                            icon={<NewestIcon width="100%" height="100%" />}
                            text="Newest"
                            paths={['/video/newest']}
                        />
                        {
                            props.auth.isAuthenticated === true &&
                            <SidebarLink
                                to="/video/history"
                                icon={<HistoryIcon width="100%" height="100%" />}
                                text="History"
                                paths={['/video/history']}
                            />
                        }
                        {
                            props.auth.isAuthenticated === true &&
                            <SidebarLink
                                to="/video/following"
                                icon={<UsersIcon width="100%" height="100%" />}
                                text="Following"
                                paths={['/video/following']}
                            />
                        }
                    </SidebarContent>
                    <SidebarContent>
                        <SidebarTitle>{width <= 1500 ? 'ACCOUNT' : 'YOUR ACCOUNT'}</SidebarTitle>
                        {
                            !props.auth.isAuthenticated &&
                            <SidebarUnauthenticated />
                        }
                        {
                            props.auth.isAuthenticated &&
                            <>
                                <SidebarLink
                                    to={`/channel/${username}`}
                                    icon={<BroadcastIcon width="100%" height="100%" />}
                                    text="My Channel"
                                    paths={[baseUrl, baseUrl + "/following", baseUrl + "/followers", baseUrl + "/likes", baseUrl + "/about"]}
                                />
                                <SidebarLink
                                    to="/video/lists"
                                    icon={<ListIcon width="100%" height="100%" />}
                                    text="Lists"
                                    paths={['/video/lists']}
                                    startsWith={['/video/list/']}
                                />
                                <SidebarNotifications />
                            </>
                        }
                    </SidebarContent>
                </div>
                {
                    props.auth.isAuthenticated ? <SidebarFooter><SidebarPostButton video={true} /></SidebarFooter> : null
                }
            </Sidebar>
        </SidebarProvider>
    );
}

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth };
};

export default connect(mapStateToProps)(HomeNav);
