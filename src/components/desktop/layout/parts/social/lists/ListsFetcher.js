// @flow

import React, {useEffect} from "react";
import axios from "axios";

import {API_URL} from "../../../../../../util/constants";
import {
    UPDATE_ERROR,
    UPDATE_LISTS,
    useListsDispatch, useListsState,
} from "./context";

function ListsFetcher(props) {
    const dispatch = useListsDispatch();
    const state = useListsState();

    useEffect(() => {

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        axios.get(API_URL + `/lists`, config)
            .then(function (res) {
                dispatch({ type: UPDATE_LISTS, payload: res.data.data.lists });
            })
            .catch(function (err) {
                dispatch({ type: UPDATE_ERROR });
            });
    }, [state.loadingLists]);

    return props.children;
}

export default ListsFetcher;
