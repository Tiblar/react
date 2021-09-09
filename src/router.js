// @flow

import React, {useEffect} from "react";
import {Router, Redirect, Switch, Route} from "react-router-dom";
import {connect} from "react-redux";

import RouteLayout from "./util/components/RouteLayout";

import Social from "./components/desktop/layout/portals/Social";
import SocialProfile from "./components/desktop/layout/portals/SocialProfile";
import Chat from "./components/desktop/layout/portals/Chat";
import Video from "./components/desktop/layout/portals/Video";
import VideoProfile from "./components/desktop/layout/portals/VideoProfile";

import Login from "./components/desktop/pages/auth/Login";
import Register from "./components/desktop/pages/auth/Register";
import ConfirmEmail from "./components/desktop/pages/auth/ConfirmEmail";
import DisableTwoFactorEmail from "./components/desktop/pages/auth/DisableTwoFactorEmail";
import TwoFactorLoginLink from "./components/desktop/pages/auth/TwoFactorLoginLink";
import Forgot from "./components/desktop/pages/auth/Forgot";
import ResetPassword from "./components/desktop/pages/auth/ResetPassword";

import SocialHome from "./components/desktop/pages/social/SocialHome";
import Post from "./components/desktop/pages/social/feed/Post";

import Profile from "./components/desktop/pages/profile/Profile";
import Following from "./components/desktop/pages/profile/Following";
import Followers from "./components/desktop/pages/profile/Followers";
import SocialLikes from "./components/desktop/pages/profile/SocialLikes";
import VideoLikes from "./components/desktop/pages/profile/VideoLikes";
import About from "./components/desktop/pages/profile/About";
import Notifications from "./components/desktop/pages/social/Notifications";
import Analytics from "./components/desktop/pages/social/Analytics";
import Lists from "./components/desktop/pages/social/lists/Lists";
import List from "./components/desktop/pages/social/lists/List";

import LeaderboardInvites from "./components/desktop/pages/social/Leaderboard";

import SupportHome from "./components/desktop/pages/support/SupportHome";
import SupportContact from "./components/desktop/pages/support/sections/Contact";
import SupportRules from "./components/desktop/pages/support/sections/Rules";
import SupportTOS from "./components/desktop/pages/support/sections/ToS";
import SupportFinancials from "./components/desktop/pages/support/sections/Financials";
import SupportAbout from "./components/desktop/pages/support/sections/About";
import PayPalSuccess from "./components/desktop/pages/support/upgrade/PayPalSuccess";
import CreditSuccess from "./components/desktop/pages/support/upgrade/CreditSuccess";

import SocialTrending from "./components/desktop/pages/social/feed/Trending";
import SocialNewest from "./components/desktop/pages/social/feed/Newest";
import SocialSearch from "./components/desktop/pages/social/search/Search";

import ChatHome from "./components/desktop/pages/chat/Chat";
import Invite from "./components/desktop/pages/chat/Invite";

import VideoHome from "./components/desktop/pages/video/VideoHome";
import VideoTrending from "./components/desktop/pages/video/Trending";
import VideoNewest from "./components/desktop/pages/video/Newest";
import VideoWatch from "./components/desktop/pages/video/Watch";
import VideoHistory from "./components/desktop/pages/video/History";
import VideoFollowing from "./components/desktop/pages/video/Following";
import VideoLists from "./components/desktop/pages/video/Lists";
import VideoList from "./components/desktop/pages/video/List";
import VideoSearch from "./components/desktop/pages/video/Search";
import Channel from "./components/desktop/pages/video/Channel";

import DiscordConnection from "./components/desktop/pages/connection/Discord";

import ConnectionError from "./components/desktop/pages/ConnectionError";
import NotFound from "./components/desktop/pages/NotFound";

import AuthError from "./components/desktop/pages/AuthError";
import LoadUser from "./components/desktop/pages/LoadUser";

import history from "./util/history";
import {updatePath} from "./reducers/portal/actions";
import {AUTH_ERROR} from "./reducers/auth/constants";

import ErrorBoundary from "./util/components/ErrorBoundary";
import LayerManager from "./components/desktop/layout/layer/LayerManager";
import { LayerProvider } from "./components/desktop/layout/layer/context";
import {makeError, makeIsAuthenticated, makeIsUserNull} from "./reducers/auth/selectors";
import {makeIsConnected} from "./reducers/connection/selectors";

function App(props) {

  useEffect(() => {
    const unlisten = history.listen(location =>  {
      if(location.hash === "" || props.portal !== "SOCIAL"){
        props.updatePortalPath(location.pathname + location.hash)
      }
    });

    return () => {
      unlisten();
    }
  });

  return (
      <ErrorBoundary>
        <Router history={history}>
          <LayerProvider>
            <LayerManager />
            <Switch>
              {
                history.location.pathname.substr(-1) === "/" &&
                <Redirect from="/:url*(/+)" to={history.location.pathname.slice(0, -1)} />
              }

              <Redirect from="/feed" to={"/social/feed"} />
              <Redirect from="/newest" to={"/social/newest"} />
              <Redirect from="/trending" to={"/social/trending"} />

              {
                props.isConnected === false &&
                <Route component={ConnectionError} />
              }

              {
                props.isAuthenticated && props.error === AUTH_ERROR &&
                <Route component={AuthError} />
              }

              {/** Don't reset when user is loaded, put before below **/}
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />

              {
                props.isAuthenticated === true && props.isUserNull &&
                <Route component={LoadUser} />
              }

              <Route exact path="/inv" component={Invite} />

              <Route exact path="/forgot" component={Forgot} />

              <Route exact path="/auth/confirm-email/:code" component={ConfirmEmail} />
              <Route exact path="/auth/disable-2fa/email/:code" component={DisableTwoFactorEmail} />
              <Route exact path="/auth/two-factor/login/:code" component={TwoFactorLoginLink} />
              <Route exact path="/auth/reset/:code" component={ResetPassword} />

              {
                props.isAuthenticated === true &&
                <Route exact path="/connect/discord" component={DiscordConnection} />
              }

              <Route exact path="/support" component={SupportHome} />
              <Route exact path="/support/pages/contact" component={SupportContact} />
              <Route exact path="/support/pages/rules" component={SupportRules} />
              <Route exact path="/support/pages/tos" component={SupportTOS} />
              <Route exact path="/support/pages/rules" component={SupportTOS} />
              <Route exact path="/support/pages/financials" component={SupportFinancials} />
              <Route exact path="/support/pages/about" component={SupportAbout} />
              <Route exact path="/support/boost/success/paypal" component={PayPalSuccess} />
              <Route exact path="/support/boost/success/cc" component={CreditSuccess} />

              <RouteLayout exact layout={Video} path="/video" component={VideoHome} />
              <RouteLayout exact layout={Video} path="/video/trending" component={VideoTrending} />
              <RouteLayout exact layout={Video} path="/video/newest" component={VideoNewest} />
              <RouteLayout exact layout={Video} path="/watch/:id" component={VideoWatch} />
              {
                props.isAuthenticated === true &&
                <RouteLayout exact layout={Video} path="/video/history" component={VideoHistory} />
              }
              {
                props.isAuthenticated === true &&
                <RouteLayout exact layout={Video} path="/video/following" component={VideoFollowing} />
              }
              {
                props.isAuthenticated === false &&
                <Route exact path="/video/following" component={NotFound} />
              }
              {
                props.isAuthenticated === true &&
                <RouteLayout exact layout={Video} path="/video/lists" component={VideoLists} />
              }

              <RouteLayout exact layout={Video} path="/video/list/:id" component={VideoList} />
              <RouteLayout exact layout={VideoProfile} path="/channel/:username" component={Channel} />
              <RouteLayout exact layout={VideoProfile} path="/channel/:username/following" component={Following} />
              <RouteLayout exact layout={VideoProfile} path="/channel/:username/followers" component={Followers} />
              <RouteLayout exact layout={VideoProfile} path="/channel/:username/likes" component={VideoLikes} />
              <RouteLayout exact layout={VideoProfile} path="/channel/:username/about" component={About} />

              <Redirect exact from="/social" to="/social/feed" />

              {
                props.isAuthenticated === false &&
                <Redirect exact from="/" to="/social/trending" />
              }

              <Redirect exact from="/" to="/social/feed" />

              <RouteLayout exact layout={Social} path="/social/feed" component={SocialHome} />
              <RouteLayout exact layout={Social} path="/social/trending" component={SocialTrending} />
              <RouteLayout exact layout={Social} path="/social/newest" component={SocialNewest} />
              <RouteLayout exact layout={Social} path="/post/:postId" component={Post} />
              <RouteLayout exact layout={Social} path="/leaderboard" component={LeaderboardInvites} />
              <RouteLayout exact layout={Social} path="/leaderboard/posts" component={LeaderboardInvites} />
              <RouteLayout exact layout={Social} path="/leaderboard/likes" component={LeaderboardInvites} />
              <RouteLayout exact layout={Social} path="/leaderboard/followers" component={LeaderboardInvites} />
              {
                props.isAuthenticated === true &&
                <RouteLayout exact layout={Social} path="/analytics" component={Analytics} />
              }
              {
                props.isAuthenticated === true &&
                <RouteLayout exact layout={Social} path="/social/lists" component={Lists} />
              }

              <RouteLayout exact layout={Social} path="/social/list/:id" component={List} />

              {
                props.isAuthenticated === true &&
                <RouteLayout exact layout={props.portal === "VIDEO" ? Video : Social} path="/notifications" component={Notifications} />
              }

              <RouteLayout exact layout={Social} path="/search/:query" component={SocialSearch} />
              <RouteLayout exact layout={Video} path="/video/search/:query" component={VideoSearch} />

              {
                props.isAuthenticated === true &&
                <RouteLayout exact layout={Chat} path="/chat" component={ChatHome}/>
              }

              {
                props.isAuthenticated === false &&
                <Redirect from="/chat" to="/login" />
              }

              <RouteLayout exact layout={SocialProfile} path="/:username([A-Za-z0-9_]{1,32})" component={Profile} />
              <RouteLayout exact layout={SocialProfile} path="/:username([A-Za-z0-9_]{1,32})/following" component={Following} />
              <RouteLayout exact layout={SocialProfile} path="/:username([A-Za-z0-9_]{1,32})/followers" component={Followers} />
              <RouteLayout exact layout={SocialProfile} path="/:username([A-Za-z0-9_]{1,32})/likes" component={SocialLikes} />
              <RouteLayout exact layout={SocialProfile} path="/:username([A-Za-z0-9_]{1,32})/about" component={About} />

              <Route path={"/social/*"} component={NotFound} />
              <Route component={NotFound} />
            </Switch>
          </LayerProvider>
        </Router>
      </ErrorBoundary>
  );
}

const mapStateToProps = () => {
  const getIsAuthenticated = makeIsAuthenticated();
  const getIsUserNull = makeIsUserNull();
  const getError = makeError();

  const getIsConnected = makeIsConnected();

  return (state) => {
    const { portal } = state;

    const isAuthenticated = getIsAuthenticated(state);
    const isUserNull = getIsUserNull(state);
    const error = getError(state);

    const isConnected = getIsConnected(state);

    return {
      isConnected: isConnected,
      isAuthenticated: isAuthenticated,
      isUserNull: isUserNull,
      error: error,
      portal: portal.portal,
    }
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updatePortalPath: path => dispatch(updatePath(path))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

// If route starts with
export const authRoutes = ["/register$", "/login$", "/forgot$", "/auth/*", "/inv"];
