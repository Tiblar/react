// @flow

import React from "react";
import {connect} from "react-redux";

import Dropdown from "../../../../../../util/form/components/Dropdown";
import {UPDATE_HISTORICAL_TIME_PERIOD, useAnalyticsDispatch, useAnalyticsState} from "./context";

import {
    ALL_TIME,
    PAST_6_MONTHS,
    PAST_MONTH,
    PAST_YEAR,
    PERIOD_SORT
} from "../../../../../../util/constants";

function PeriodDropdown(props) {

    const state = useAnalyticsState();
    const dispatch = useAnalyticsDispatch();

    let periodDrop = [
        {
            title: PERIOD_SORT[PAST_MONTH],
            type: Dropdown.CLICK_TYPE,
            action: () => {dispatch({type: UPDATE_HISTORICAL_TIME_PERIOD, payload: 1})}
        },
        {
            title: PERIOD_SORT[PAST_6_MONTHS],
            type: Dropdown.CLICK_TYPE,
            action: () => {dispatch({type: UPDATE_HISTORICAL_TIME_PERIOD, payload: 2})}
        },
        {
            title: PERIOD_SORT[PAST_YEAR],
            type: Dropdown.CLICK_TYPE,
            action: () => {dispatch({type: UPDATE_HISTORICAL_TIME_PERIOD, payload: 3})}
        },
        {
            title: PERIOD_SORT[ALL_TIME],
            type: Dropdown.CLICK_TYPE,
            action: () => {dispatch({type: UPDATE_HISTORICAL_TIME_PERIOD, payload: 4})}
        },
    ];

    return (
        <Dropdown title={PERIOD_SORT[state.historicalTimePeriod + 2]} items={periodDrop} />
    );
}

const mapStateToProps = state => {
    const { social } = state;
    return { social: social };
};

export default connect(mapStateToProps)(PeriodDropdown);
