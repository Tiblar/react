// @flow

import React, {useEffect} from "react";
import axios from "axios";

import {API_URL} from "../../../../../../util/constants";
import {
    UPDATE_ERROR,
    UPDATE_HISTORICAL_STATS,
    UPDATE_RECENT_STATS,
    useAnalyticsDispatch,
    useAnalyticsState
} from "./context";

function AnalyticsFetcher(props) {
    const state = useAnalyticsState();
    const dispatch = useAnalyticsDispatch();

    useEffect(() => {

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        axios.get(API_URL + `/users/@me/analytics/recent`, config)
            .then(function (res) {
                dispatch({ type: UPDATE_RECENT_STATS, payload: res.data.data });
            })
            .catch(function (err) {
                dispatch({ type: UPDATE_ERROR });
            });
    }, []);

    useEffect(() => {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        axios.get(API_URL + `/users/@me/analytics/historical?period=${state.historicalTimePeriod}`, config)
            .then(function (res) {
                dispatch({ type: UPDATE_HISTORICAL_STATS, payload: res.data.data });
            })
            .catch(function (err) {
                dispatch({ type: UPDATE_ERROR });
            });
    }, [state.historicalTimePeriod]);

    return props.children;
}

export default AnalyticsFetcher;
