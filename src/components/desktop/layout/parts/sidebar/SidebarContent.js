import React from "react";

import layoutStyles from "../../../../../css/layout.css";

function SidebarContent(props) {
    return (
        <div className={layoutStyles.flex + " " + layoutStyles.flexColumn + " " + layoutStyles.flexExpandAuto + " " + layoutStyles.mT1 + ' ' + layoutStyles.mB1}>
            {props.children}
        </div>
    )
}

export default SidebarContent;
