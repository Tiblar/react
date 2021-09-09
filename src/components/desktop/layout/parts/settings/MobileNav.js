// @flow

import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { topNav } from "../../../../../css/layout/main.css";
import topStyles from "../../../../../css/layout/social/nav/top.css";
import layoutStyles from "../../../../../css/layout.css";

import CloseIcon from "../../../../../assets/svg/icons/times.svg";

import {CONTAINER, REVERT, useLayerDispatch} from "../../layer/context";
import HamburgerIcon from "../../../../../assets/svg/icons/bars.svg";

function FeedTopNav(props) {
    const dispatch = useLayerDispatch();

    function handleClose() {
        dispatch({ type: CONTAINER, payload: REVERT });
    }

    return (
        <div className={topNav}>
            <div
                className={topStyles.icon + " " + layoutStyles.mL1 + " " + layoutStyles.mR1}
                onClick={handleClose}>
                <CloseIcon height={35} />
            </div>
            <div
                className={topStyles.icon + " " + layoutStyles.mL + " " + layoutStyles.mR1}
                onClick={props.toggleMobileSidebar}>
                {
                    !props.mobileSidebar &&
                    <HamburgerIcon height={35} />
                }
                {
                    props.mobileSidebar &&
                    <CloseIcon height={35} />
                }
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth };
};

FeedTopNav.propTypes = {
    toggleMobileSidebar: PropTypes.func.isRequired,
    mobileSidebar: PropTypes.bool.isRequired
}

export default connect(mapStateToProps)(FeedTopNav);
