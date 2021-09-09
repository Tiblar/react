// @flow

import React from "react";

import navStyles from "../../../../../../css/components/tabs-nav.css";

import history from "../../../../../../util/history";

function LeaderboardNav(props) {

    let params = new URLSearchParams(history.location.search);

    return (
        <div className={navStyles.nav}>
            <div className={navStyles.pages}>
                <div onClick={() => { history.push(`/leaderboard`) }}
                     className={navStyles.page}>
                    <label>
                        Invites
                    </label>
                    {
                        params.get('tab') === null &&
                        <span className={navStyles.active}/>
                    }
                </div>
                <div onClick={() => { history.push(`/leaderboard?tab=posts`) }}
                     className={navStyles.page}>
                    <label>
                        Posts
                    </label>
                    {
                        params.get('tab') === 'posts' &&
                        <span className={navStyles.active}/>
                    }
                </div>
                <div onClick={() => { history.push(`/leaderboard?tab=likes`) }}
                     className={navStyles.page}>
                    <label>
                        Likes
                    </label>
                    {
                        params.get('tab') === 'likes' &&
                        <span className={navStyles.active}/>
                    }
                </div>
                <div onClick={() => { history.push(`/leaderboard?tab=followers`) }}
                     className={navStyles.page}>
                    <label>
                        Followers
                    </label>
                    {
                        params.get('tab') === 'followers' &&
                        <span className={navStyles.active}/>
                    }
                </div>
            </div>
        </div>
    );
}

export default LeaderboardNav;
