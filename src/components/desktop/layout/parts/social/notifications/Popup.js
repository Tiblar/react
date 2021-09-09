// @flow

import React from "react";

import nStyles from "../../../../../../css/components/notification.css";

import PopupContainer from "./PopupContainer";

import {AccountCenterProvider} from "./context";
import useWindowDimensions from "../../../../../../util/hooks/useWindowDimensions";

const Popup = React.forwardRef((props, ref) => {
    const {height} = useWindowDimensions();

    return (
        <div className={nStyles.popup}
             style={{maxHeight: Math.floor(height/2) + "px", top: Math.floor(height/6) + "px"}} ref={ref}>
            <AccountCenterProvider>
                <PopupContainer />
            </AccountCenterProvider>
        </div>
    );
});

export default Popup;
