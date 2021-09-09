// @flow

import React, {useState} from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import topStyles from "../../../../../../../css/layout/social/nav/top.css";
import layoutStyles from "../../../../../../../css/layout.css";

import HamburgerIcon from "../../../../../../../assets/svg/icons/bars.svg";

import PulloutNav from "../left/PulloutNav";

function Hamburger(props) {
    const [manager, setManager] = useState({
        show: false,
    });

    function handleSidebar() {
        setManager(manager => ({
            ...manager,
            show: true,
        }))
    }

    function hideSidebar() {
        setManager(manager => ({
            ...manager,
            show: false,
        }))
    }

    return [
        (
            manager.show && <PulloutNav key="nav-pullout" theme={props.theme} hideSidebar={hideSidebar} />
        ),
        (
            <div
                key="nav-hamburger-icon"
                className={topStyles.icon + " " + layoutStyles.mL1 + " " + layoutStyles.mR1}
                onClick={handleSidebar}>
                <HamburgerIcon height={35} />
            </div>
        )
    ];
}

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth };
};

Hamburger.propTypes = {
    theme: PropTypes.string
}

Hamburger.defaultProps = {
    theme: null,
}

export default connect(mapStateToProps)(Hamburger);
