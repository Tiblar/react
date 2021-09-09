// @flow

import React from "react";

import NotificationsNav from "../nav/NotificationsNav";

import ListTab from "./tabs/ListTab";
import {NAV_NOTIFICATIONS, NAV_REQUESTS, useAccountCenterContextState} from "./context";
import RequestTab from "./tabs/RequestTab";

function Notifications(props) {
    const {nav} = useAccountCenterContextState();

    return (
        <div style={{maxWidth: "600px"}}>
            <NotificationsNav />
            {
                nav.notification === NAV_NOTIFICATIONS &&
                <ListTab />
            }
            {
                nav.notification === NAV_REQUESTS &&
                <RequestTab />
            }
        </div>
    );
}

export default Notifications;
