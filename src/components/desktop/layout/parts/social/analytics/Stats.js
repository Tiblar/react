// @flow

import React, {Suspense} from "react";

import analyticsStyles from "../../../../../../css/layout/social/analytics.css";
import layoutStyles from "../../../../../../css/layout.css";

const RecentViews = React.lazy(() => import("./stats/RecentViews"));
const HistoricalAnalytics = React.lazy(() => import("./stats/HistoricalAnalytics"));

import AnalyticsNav from "../nav/AnalyticsNav";

import {useAnalyticsState} from "./context";
import PeriodDropdown from "./PeriodDropdown";

import useWindowDimensions from "../../../../../../util/hooks/useWindowDimensions";

function Stats() {

    const {width} = useWindowDimensions();

    const state = useAnalyticsState();

    return (
        <div className={analyticsStyles.analytics}>
            <div className={analyticsStyles.main}>
                <AnalyticsNav />
                {
                    width <= 1250 &&
                    <div className={layoutStyles.flex + ' ' + layoutStyles.alignItemsCenter + ' ' + layoutStyles.mT1 + ' ' + layoutStyles.mB1}>
                        <PeriodDropdown />
                    </div>
                }
                {
                    (state.historicalStats) &&
                    <Suspense fallback={<div className={layoutStyles.mT1}>Loading...</div>}>
                        <HistoricalAnalytics data={state.historicalStats} />
                    </Suspense>
                }
            </div>
            {
                (state.recentStats && state.recentStats.recent_views && state.recentStats.top_posts) &&
                <div className={analyticsStyles.sidebar}>
                    <Suspense fallback={<></>}>
                        <RecentViews data={state.recentStats} />
                    </Suspense>
                </div>
            }
        </div>
    );
}

export default Stats;
