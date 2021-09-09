// @flow

import React from "react";
import {connect} from "react-redux";

import Dropdown from "../../../../../../../util/form/components/Dropdown";

import {
    ALL_TIME,
    PAST_6_MONTHS,
    PAST_DAY,
    PAST_MONTH,
    PAST_WEEK, PAST_YEAR,
    PERIOD_SORT
} from "../../../../../../../util/constants";
import store from "../../../../../../../store";
import {updatePeriod} from "../../../../../../../reducers/social/actions";

function PeriodDropdown(props) {

    let periodDrop = [
        {
            title: PERIOD_SORT[PAST_DAY],
            type: Dropdown.CLICK_TYPE,
            action: () => {store.dispatch(updatePeriod(PAST_DAY))}
        },
        {
            title: PERIOD_SORT[PAST_WEEK],
            type: Dropdown.CLICK_TYPE,
            action: () => {store.dispatch(updatePeriod(PAST_WEEK))}
        },
        {
            title: PERIOD_SORT[PAST_MONTH],
            type: Dropdown.CLICK_TYPE,
            action: () => {store.dispatch(updatePeriod(PAST_MONTH))}
        },
        {
            title: PERIOD_SORT[PAST_6_MONTHS],
            type: Dropdown.CLICK_TYPE,
            action: () => {store.dispatch(updatePeriod(PAST_6_MONTHS))}
        },
        {
            title: PERIOD_SORT[PAST_YEAR],
            type: Dropdown.CLICK_TYPE,
            action: () => {store.dispatch(updatePeriod(PAST_YEAR))}
        },
        {
            title: PERIOD_SORT[ALL_TIME],
            type: Dropdown.CLICK_TYPE,
            action: () => {store.dispatch(updatePeriod(ALL_TIME))}
        },
    ];

    return (
        <Dropdown title={PERIOD_SORT[props.social.period]} items={periodDrop} />
    );
}

const mapStateToProps = state => {
    const { social } = state;
    return { social: social };
};

export default connect(mapStateToProps)(PeriodDropdown);
