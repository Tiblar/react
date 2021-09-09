import React from "react";

import {container} from "../../../css/layout/connection-error.css";

import LogoIcon from "../../../assets/svg/logo-icon.svg";
import AutoAuth from "../layout/AutoAuth";

function LoadUser() {
    return (
        <AutoAuth>
            <div className={container}>
                <LogoIcon width={75}/>
            </div>
        </AutoAuth>
    );
}

export default LoadUser;
