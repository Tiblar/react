// @flow

import React, {useEffect} from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {isMobile} from "is-mobile";

import layoutStyles from "../../../../../../../css/layout.css";
import navStyles from "../../../../../../../css/components/pullout-nav.css";
import mainStyles from "../../../../../../../css/layout/main.css";
import topStyles from "../../../../../../../css/layout/social/nav/top.css";

import TimesIcon from "../../../../../../../assets/svg/icons/times.svg";

import PortalNav from "../../../../PortalNav";
import Actions from "../top/Actions";
import HomeNav from "./HomeNav";

import history from "../../../../../../../util/history";
import SidebarLogo from "../../../sidebar/SidebarLogo";

function PulloutNav(props) {

    useEffect(() => {
        return history.listen(props.hideSidebar)
    },[history])

    return (
        <div className={navStyles.nav}>
            <div className={layoutStyles.positionRelative + ' ' + layoutStyles.flex + ' ' + layoutStyles.flexColumn + ' ' + layoutStyles.hF}>
                <div className={mainStyles.topNav}>
                    <div className={topStyles.icon + " " + layoutStyles.mL1 + " " + layoutStyles.mR1} onClick={props.hideSidebar}>
                        <TimesIcon height={35} />
                    </div>
                    <div className={layoutStyles.mL}>
                        <SidebarLogo redirect="/social" theme={props.theme} small={true} />
                    </div>
                    <Actions />
                </div>
                {
                    isMobile() &&
                    <div className={layoutStyles.flex + ' ' + layoutStyles.flexColumn + ' ' + layoutStyles.flexGrow + ' ' + layoutStyles.hF}>
                        <HomeNav theme={props.theme} />
                        <PortalNav showMobile={true} />
                    </div>
                }
                {
                    !isMobile() &&
                    <div className={layoutStyles.flex + ' ' + layoutStyles.flexGrow + ' ' + layoutStyles.hF}>
                        <PortalNav showMobile={true} />
                        <HomeNav theme={props.theme} />
                    </div>
                }
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    const { auth, notifications } = state;
    return { auth: auth, notifications: notifications };
};

PulloutNav.propTypes = {
    hideSidebar: PropTypes.func.isRequired,
    theme: PropTypes.string,
}

PulloutNav.defaultProps = {
    theme: null,
}

export default connect(mapStateToProps)(PulloutNav);
