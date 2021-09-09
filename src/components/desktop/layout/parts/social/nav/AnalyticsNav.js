// @flow

import React from "react";

import navStyles from "../../../../../../css/components/tabs-nav.css";
import layoutStyles from "../../../../../../css/layout.css";
import analyticsStyles from "../../../../../../css/layout/social/analytics.css";

import {UPDATE_HISTORICAL_CHART, useAnalyticsDispatch, useAnalyticsState} from "../analytics/context";

import history from "../../../../../../util/history";
import PeriodDropdown from "../analytics/PeriodDropdown";
import useWindowDimensions from "../../../../../../util/hooks/useWindowDimensions";

function AnalyticsNav(props) {

    const {width} = useWindowDimensions();

    const state = useAnalyticsState();
    const dispatch = useAnalyticsDispatch();

    let params = new URLSearchParams(history.location.search);

    return (
        <div className={navStyles.nav + ' ' + analyticsStyles.nav}>
            <div className={navStyles.pages}>
                <div onClick={() => { dispatch({ type: UPDATE_HISTORICAL_CHART, payload: "POST" }) }}
                     className={navStyles.page}>
                    <label>
                        Post Views
                    </label>
                    {
                        state.historicalChart === "POST" &&
                        <span className={navStyles.active}/>
                    }
                </div>
                <div onClick={() => { dispatch({ type: UPDATE_HISTORICAL_CHART, payload: "PROFILE" }) }}
                     className={navStyles.page}>
                    <label>
                        Profile Views
                    </label>
                    {
                        state.historicalChart === "PROFILE" &&
                        <span className={navStyles.active}/>
                    }
                </div>
                <div onClick={() => { dispatch({ type: UPDATE_HISTORICAL_CHART, payload: "LIKES" }) }}
                     className={navStyles.page}>
                    <label>
                        Likes
                    </label>
                    {
                        state.historicalChart === "LIKES" &&
                        <span className={navStyles.active}/>
                    }
                </div>
                <div onClick={() => { dispatch({ type: UPDATE_HISTORICAL_CHART, payload: "FOLLOWERS" }) }}
                     className={navStyles.page}>
                    <label>
                        Followers
                    </label>
                    {
                        state.historicalChart === "FOLLOWERS" &&
                        <span className={navStyles.active}/>
                    }
                </div>
                {
                    width > 1250 &&
                    <div className={layoutStyles.flex + ' ' + layoutStyles.alignItemsCenter + ' ' + layoutStyles.mL}>
                        <PeriodDropdown />
                    </div>
                }
            </div>
        </div>
    );
}

export default AnalyticsNav;
