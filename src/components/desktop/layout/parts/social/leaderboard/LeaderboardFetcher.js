// @flow

import React, {useEffect} from "react";
import axios from "axios";

import {API_URL} from "../../../../../../util/constants";
import {UPDATE_ERROR, UPDATE_STATS, useLeaderboardDispatch} from "./context";

function LeaderboardFetcher(props) {
    const dispatch = useLeaderboardDispatch();

    useEffect(() => {

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        axios.get(API_URL + `/instance/stats`, config)
            .then(function (res) {
                dispatch({ type: UPDATE_STATS, payload: res.data.data });
            })
            .catch(function (err) {
                dispatch({ type: UPDATE_ERROR });
            });
    }, []);

    return props.children;
}

export default LeaderboardFetcher;
