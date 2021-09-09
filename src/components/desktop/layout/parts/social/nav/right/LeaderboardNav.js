// @flow

import React, {useEffect, useRef} from "react";
import PerfectScrollbar from "perfect-scrollbar";

import {
    mB1, m1
} from "../../../../../../../css/layout.css";
import sidebarStyles from "../../../../../../../css/layout/social/nav/sidebar.css";
import rightSidebarStyles from "../../../../../../../css/layout/social/nav/right.css";
import cardStyles from "../../../../../../../css/components/card.css";
import formStyles from "../../../../../../../css/form.css";
import leaderboardStyles from "../../../../../../../css/layout/social/leaderboard.css";

import UserIcon from "../../../../../../../assets/svg/icons/user.svg";
import PostIcon from "../../../../../../../assets/svg/icons/star.svg";
import FileIcon from "../../../../../../../assets/svg/icons/chevronDown.svg";
import ReplyIcon from "../../../../../../../assets/svg/icons/ellipsisH.svg";

import {useLeaderboardState} from "../../leaderboard/context";
import {numberWithCommas} from "../../../../../../../util/formatNumber";
import ContentLoader from "../../../../../../../util/components/ContentLoader";

function LeaderboardNav(props) {
    const containerRef = useRef();
    const leaderboardState = useLeaderboardState();

    useEffect(() => {
        new PerfectScrollbar(containerRef.current, {
            suppressScrollX: true
        });
    }, []);

    const StatLoader = (props) => (
        <ContentLoader
            width={180}
            height={25}
            viewBox="0 0 180 25"
        >
            <rect x="0" y="0" rx="2" ry="2" width="180" height="25" />
        </ContentLoader>
    )

    return (
        <div className={sidebarStyles.sidebarContainer + ' ' + rightSidebarStyles.sidebarContainer + ' ' + leaderboardStyles.sidebar}>
            <div className={sidebarStyles.sidebar + ' ' + rightSidebarStyles.sidebar} ref={containerRef}>
                <div className={mB1}>
                    <div className={cardStyles.card + ' ' + m1}>
                        <div className={cardStyles.cardHeader}>
                            <h3>Site Statistics</h3>
                        </div>
                        <div className={cardStyles.cardBody}>
                            This gets updated every 30 minutes.
                        </div>
                    </div>
                </div>
                <div className={mB1}>
                    <div className={cardStyles.card + ' ' + m1}>
                        <div className={cardStyles.cardHeader}>
                            <h3>Site Statistics</h3>
                        </div>
                        {
                            leaderboardState.error &&
                            <div className={cardStyles.cardBody}>
                                <div className={formStyles.alert}>
                                    There was an error.
                                </div>
                            </div>
                        }
                        {
                            !leaderboardState.error &&
                            <div className={cardStyles.cardBody}>
                                {
                                    leaderboardState.loading &&
                                    <StatLoader />
                                }
                                {
                                    !leaderboardState.loading &&
                                    <div className={leaderboardStyles.section}>
                                        <UserIcon height={20} width={20} />
                                        <span>{(typeof leaderboardState.stats.stats.users === "string" ? numberWithCommas(leaderboardState.stats.stats.users) : 0)} users</span>
                                    </div>
                                }
                                <hr />
                                {
                                    leaderboardState.loading &&
                                    <StatLoader />
                                }
                                {
                                    !leaderboardState.loading &&
                                    <div className={leaderboardStyles.section}>
                                        <PostIcon height={20} width={20} />
                                        <span>{(typeof leaderboardState.stats.stats.posts === "string" ? numberWithCommas(leaderboardState.stats.stats.posts) : 0)} posts</span>
                                    </div>
                                }
                                <hr />
                                {
                                    leaderboardState.loading &&
                                    <StatLoader />
                                }
                                {
                                    !leaderboardState.loading &&
                                    <div className={leaderboardStyles.section}>
                                        <FileIcon height={20} width={20} />
                                        <span>{(typeof leaderboardState.stats.stats.storage === "number" ? leaderboardState.stats.stats.storage : 0)}  storage (GB)</span>
                                    </div>
                                }
                                <hr />
                                {
                                    leaderboardState.loading &&
                                    <StatLoader />
                                }
                                {
                                    !leaderboardState.loading &&
                                    <div className={leaderboardStyles.section}>
                                        <ReplyIcon height={20} width={20} />
                                        <span>{(typeof leaderboardState.stats.stats.comments === "string" ? numberWithCommas(leaderboardState.stats.stats.comments) : 0)} comments</span>
                                    </div>
                                }
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LeaderboardNav;
