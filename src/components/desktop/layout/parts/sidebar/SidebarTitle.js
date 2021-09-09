import React from "react";
import isMobile from "is-mobile";

import sidebarStyles from "../../../../../css/layout/social/nav/sidebar.css";

function SidebarTitle(props) {
    if(isMobile()){
        return null;
    }

    return (
        <div className={sidebarStyles.sidebarItem + " " + sidebarStyles.sidebarTitle}>
            <label>{props.children}</label>
        </div>
    )
}

export default SidebarTitle;
