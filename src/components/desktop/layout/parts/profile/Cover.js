import React from "react";
import mainStyles from "../../../../../css/layout/main.css";

import CoverGraphic from "../../../../../assets/graphics/social/cover.svg";

function Cover() {
    return (
        <div className={mainStyles.cover}>
            <CoverGraphic />
        </div>
    );
}

export default Cover;
