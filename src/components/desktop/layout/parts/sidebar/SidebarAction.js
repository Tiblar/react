import React from "react";
import PropTypes from "prop-types";

import sidebarStyles from "../../../../../css/layout/social/nav/sidebar.css";

function SidebarAction(props) {
    return (
        <div className={sidebarStyles.sidebarItem + ' ' + (props.active ? sidebarStyles.active : "")} onClick={props.onClick}>
            <div className={sidebarStyles.sidebarIcon}>
                {props.icon}
            </div>
            <span>{props.text}</span>
        </div>
    )
}

SidebarAction.propTypes = {
    active: PropTypes.bool,
    onClick: PropTypes.func,
    icon: PropTypes.element,
    text: PropTypes.string,
}

export default SidebarAction;
