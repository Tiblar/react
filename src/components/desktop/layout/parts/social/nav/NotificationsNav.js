// @flow

import React from "react";
import {connect} from "react-redux";

import navStyles from "../../../../../../css/components/tabs-nav.css";
import formStyles from "../../../../../../css/form.css";

import {
    NAV_NOTIFICATIONS,
    NAV_REQUESTS, UPDATE_NAV_NOTIFICATIONS,
    useAccountCenterContextDispatch,
    useAccountCenterContextState
} from "../notifications/context";

function NotificationsNav(props) {

    const {nav} = useAccountCenterContextState();
    const dispatch = useAccountCenterContextDispatch();

    function handleClick(nav) {
        dispatch({ type: UPDATE_NAV_NOTIFICATIONS, payload: nav })
    }

    return (
        <div className={navStyles.nav}>
            <div className={navStyles.pages}>
                <div onClick={() => { handleClick(NAV_NOTIFICATIONS) }}
                     className={navStyles.page}>
                    <label>
                        Interactions
                    </label>
                    {
                        nav.notification === NAV_NOTIFICATIONS &&
                        <span className={navStyles.active}/>
                    }
                </div>
                <div onClick={() => { handleClick(NAV_REQUESTS) }}
                     className={navStyles.page}>
                    <label>
                        Requests
                        {
                            props.notifications.social.followRequestsCount !== null &&
                            props.notifications.social.followRequestsCount > 0 &&
                            <span style={{marginLeft: "0.5rem"}} className={formStyles.badge}>
                                {props.notifications.social.followRequestsCount}
                            </span>
                        }
                    </label>
                    {
                        nav.notification === NAV_REQUESTS &&
                        <span className={navStyles.active}/>
                    }
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    const { notifications } = state;
    return { notifications: notifications };
};

export default connect(mapStateToProps)(NotificationsNav);
