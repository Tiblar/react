import React, {useEffect, useRef, useState} from 'react';
import {connect} from "react-redux";
import {useHistory} from "react-router";

import sidebarStyles from "../../../../../css/layout/social/nav/sidebar.css";

import SidebarAction from "./SidebarAction";
import {default as PopupNotifications} from "../social/notifications/Popup";

import {UPDATE_OUTSIDE_CHILDREN, useSidebarDispatch} from "./context";
import outsideClick from "../../../../../util/components/outsideClick";
import useWindowDimensions from "../../../../../util/hooks/useWindowDimensions";
import {MAX_MOBILE_WIDTH} from "../../../../../util/constants";

function SidebarNotifications(props) {

    const dispatch = useSidebarDispatch();
    const notificationsRef = useRef();
    const {width} = useWindowDimensions();

    const [manager, setManager] = useState({
        popup: false,
    });

    const [active, setActive] = useState(isActive(window.location.pathname));

    const history = useHistory();

    useEffect(() => {
        return history.listen((location) => {
            if(location.pathname === "/notifications"){
                setActive(true);
            }else{
                setActive(false);
            }
        })
    },[history])

    outsideClick(notificationsRef, () => {
        dispatch({ type: UPDATE_OUTSIDE_CHILDREN, payload: null })

        setManager(manager => ({
            ...manager,
            popup: false,
        }));
    });

    function handleNotifications() {
        if(width <= MAX_MOBILE_WIDTH){
            history.push("/notifications");
            return;
        }

        setManager(manager => ({
            ...manager,
            popup: !manager.popup,
        }))

        dispatch({ type: UPDATE_OUTSIDE_CHILDREN, payload: <PopupNotifications ref={notificationsRef} /> })
    }

    function isActive(path) {
        return path === "/notifications";
    }

    return (
        <div ref={notificationsRef}>
            <SidebarAction
                icon={
                    props.notificationsCount !== null ?
                        <div className={sidebarStyles.notification}>
                            {
                                props.notifications.social.notificationsCount < 99 ?
                                    props.notifications.social.notificationsCount : "99+"
                            }
                        </div> : null
                }
                text="Notifications"
                active={manager.popup || active}
                onClick={handleNotifications}
            />
        </div>
    )
}

const mapStateToProps = state => {
    const { notifications } = state;
    return { notifications: notifications };
};

export default connect(mapStateToProps)(SidebarNotifications);
