import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";

import layoutStyles from "../../../../../../../css/layout.css";

import FeedIcon from "../../../../../../../assets/svg/icons/list.svg";
import TrendingIcon from "../../../../../../../assets/svg/icons/rocket.svg";
import NewestIcon from "../../../../../../../assets/svg/icons/clock.svg";
import LeaderboardIcon from "../../../../../../../assets/svg/icons/flag.svg";
import UserIcon from "../../../../../../../assets/svg/icons/user.svg";
import AnalyticsIcon from "../../../../../../../assets/svg/icons/chart.svg";
import ListIcon from "../../../../../../../assets/svg/icons/list-alt.svg";

import {SidebarProvider} from "../../../sidebar/context";
import SidebarNotifications from "../../../sidebar/SidebarNotifications";
import Sidebar from "../../../sidebar/Sidebar";
import SidebarLogo from "../../../sidebar/SidebarLogo";
import SidebarContent from "../../../sidebar/SidebarContent";
import SidebarTitle from "../../../sidebar/SidebarTitle";
import SidebarLink from "../../../sidebar/SidebarLink";
import SidebarUnauthenticated from "../../../sidebar/SidebarUnauthenticated";
import SidebarPostButton from "../../../sidebar/SidebarPostButton";

import useWindowDimensions from "../../../../../../../util/hooks/useWindowDimensions";
import SidebarFooter from "../../../sidebar/SidebarFooter";

function HomeSecure(props) {
    const {width} = useWindowDimensions();

    let username = props.auth.user !== null ? props.auth.user.info.username : null;
    let baseUrl = "/" + username;

    return (
        <SidebarProvider>
            <Sidebar>
                {
                    width > 900 &&
                    <SidebarLogo redirect="/social" theme={props.theme} />
                }
                <div>
                    <SidebarContent>
                        <SidebarTitle>POSTS</SidebarTitle>
                        {props.auth.isAuthenticated && (
                          <SidebarLink
                              to="/social/feed"
                              icon={<FeedIcon width="100%" height="100%" />}
                              text="Feed"
                              paths={['/social/feed']}
                          />
                        )}
                        <SidebarLink
                            to="/social/trending"
                            icon={<TrendingIcon width="100%" height="100%" />}
                            text="Trending"
                            paths={['/social/trending']}
                        />
                        <SidebarLink
                            to="/social/newest"
                            icon={<NewestIcon width="100%" height="100%" />}
                            text="Newest"
                            paths={['/social/newest']}
                        />
                        <SidebarLink
                            to="/leaderboard"
                            icon={<LeaderboardIcon width="100%" height="100%" />}
                            text="Leaderboard"
                            paths={['/leaderboard', '/leaderboard/']}
                        />
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
                                    to={`/${username}`}
                                    icon={<UserIcon width="100%" height="100%" />}
                                    text="My Profile"
                                    paths={[baseUrl, baseUrl + "/following", baseUrl + "/followers", baseUrl + "/likes", baseUrl + "/about"]}
                                />
                                <SidebarLink
                                    to="/analytics"
                                    icon={<AnalyticsIcon width="100%" height="100%" />}
                                    text="Analytics"
                                    paths={['/analytics']}
                                />
                                <SidebarLink
                                    to="/social/lists"
                                    icon={<ListIcon width="100%" height="100%" />}
                                    text="Lists"
                                    paths={['/social/lists']}
                                    startsWith={['/social/list/']}
                                />
                                <SidebarNotifications />
                            </>
                        }
                    </SidebarContent>
                </div>
                {
                    props.auth.isAuthenticated ? <SidebarFooter><SidebarPostButton /></SidebarFooter> : null
                }
            </Sidebar>
        </SidebarProvider>
    );
}

const mapStateToProps = state => {
    const { auth, notifications } = state;
    return { auth: auth, notifications: notifications };
};

HomeSecure.propTypes = {
    theme: PropTypes.string,
};

export default connect(mapStateToProps)(HomeSecure);
