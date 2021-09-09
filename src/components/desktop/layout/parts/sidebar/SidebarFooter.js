import React from "react";

import layoutStyles from "../../../../../css/layout.css";

function SidebarFooter(props) {
    return (
        <div className={layoutStyles.mT + " " + layoutStyles.mB1 + " " + layoutStyles.mL1 + " " + layoutStyles.mR1}>
            {props.children}
        </div>
    )
}

export default SidebarFooter;
