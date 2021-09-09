// @flow

import React, {useEffect, useRef} from "react";
import PerfectScrollbar from "perfect-scrollbar";

import layoutStyles from "../../../../../../css/layout.css";
import nStyles from "../../../../../../css/components/notification.css";

import NotificationsNav from "../nav/NotificationsNav";

import ListTab from "./tabs/ListTab";
import RequestTab from "./tabs/RequestTab";

import {NAV_NOTIFICATIONS, NAV_REQUESTS, useAccountCenterContextState} from "./context";

function PopupContainer(props) {
    const containerRef = useRef();
    const scrollRef = useRef();
    const _isMounted = useRef(true);

    const {nav, scrolling} = useAccountCenterContextState();

    useEffect(() => {
        scrollRef.current = new PerfectScrollbar(containerRef.current, {
            suppressScrollX: true
        });
    }, []);

    useEffect(() => {

        let current = containerRef.current.scrollTop;

        const stopScrolling = (e) => {
            containerRef.current.scrollTop = current;
        };

        if(!scrolling && scrollRef.current && _isMounted.current){
            containerRef.current.addEventListener('ps-scroll-y', stopScrolling);
        }

        return () => {
            containerRef.current.removeEventListener('ps-scroll-y', stopScrolling);
        }
    }, [scrolling, scrollRef.current]);

    useEffect(() => {
        return () => {
            _isMounted.current = false
        }
    }, []);

    useEffect(() => {
        if(scrollRef.current && _isMounted.current){
            scrollRef.current.update();
        }
    }, [scrollRef.current, nav])

    return (
        <div className={
            layoutStyles.positionRelative + ' ' + layoutStyles.flex
            + ' ' + layoutStyles.flexColumn + ' ' + layoutStyles.wF
        }>
            <NotificationsNav />
            <div className={layoutStyles.positionRelative + ' ' + layoutStyles.flexGrow}>
                <div ref={containerRef}
                     className={nStyles.listContainer}>
                    {
                        nav.notification === NAV_NOTIFICATIONS &&
                        <ListTab noCard={true} />
                    }
                    {
                        nav.notification === NAV_REQUESTS &&
                        <RequestTab noCard={true} />
                    }
                </div>
            </div>
        </div>
    );
}

export default PopupContainer;
