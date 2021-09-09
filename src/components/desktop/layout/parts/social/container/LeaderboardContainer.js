// @flow

import React, {useEffect, useRef, useState} from "react";

import {wF, positionRelative} from "../../../../../../css/layout.css";
import {container} from "../../../../../../css/layout/social/container/main.css";

import LeaderboardNav from "../nav/right/LeaderboardNav";
import MainContainer from "./MainContainer";
import PerfectScrollbar from "perfect-scrollbar";

import {LeaderboardProvider} from "../leaderboard/context";
import LeaderboardFetcher from "../leaderboard/LeaderboardFetcher";
import useWindowDimensions from "../../../../../../util/hooks/useWindowDimensions";
import {MAX_MOBILE_WIDTH} from "../../../../../../util/constants";

function LeaderboardContainer(props) {
    const containerRef = useRef();
    const {width} = useWindowDimensions();

    useEffect(() => {
        new PerfectScrollbar(containerRef.current, {
            suppressScrollX: true
        });
    }, [containerRef.current]);

    return (
        <MainContainer>
            <LeaderboardProvider>
                <LeaderboardFetcher>
                    <div className={wF + ' ' + positionRelative}>
                        <div className={container} ref={containerRef}>
                            {props.children}
                        </div>
                    </div>
                    {
                        width > MAX_MOBILE_WIDTH &&
                        <LeaderboardNav />
                    }
                </LeaderboardFetcher>
            </LeaderboardProvider>
        </MainContainer>
    );
}

export default LeaderboardContainer;
