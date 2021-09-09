import React, {useEffect, useRef} from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import PerfectScrollbar from "perfect-scrollbar";

import sidebarStyles from "../../../../../css/layout/social/nav/sidebar.css";
import cloverStyles from "../../../../../css/themes/clover-theme.css";
import newspaperStyles from "../../../../../css/themes/newspaper-theme.css";
import outrunStyles from "../../../../../css/themes/outrun-theme.css";
import cyberpunkStyles from "../../../../../css/themes/cyberpunk-theme.css";
import cozyStyles from "../../../../../css/themes/cozy-theme.css";
import skeletonStyles from "../../../../../css/themes/skeleton-theme.css";

import OutsideChildren from "./OutsideChildren";

import {
    CLOVER_THEME,
    COZY_THEME,
    CYBERPUNK_THEME,
    NEWSPAPER_THEME,
    OUTRUN_THEME,
    SKELETON_THEME
} from "../../../../../util/constants";

function Sidebar(props) {
    const containerRef = useRef();
    const scrollRef = useRef();
    const _isMounted = useRef(true);

    useEffect(() => {
        return () => {
            _isMounted.current = false
        }
    }, []);

    useEffect(() => {
        scrollRef.current = new PerfectScrollbar(containerRef.current, {
            suppressScrollX: true
        });
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if(scrollRef.current && _isMounted.current){
                scrollRef.current.update();
            }
        }, 200);

        return () => {
            clearTimeout(timeout);
        };
    }, [scrollRef.current])

    function themeBackground() {
        let navPos = 'leftNav';

        if(props.direction === 'right'){
            navPos = 'rightNav';
        }

        if(props.theme === null){
            return "";
        }

        if(props.theme === OUTRUN_THEME && outrunStyles[navPos]){
            return ' ' + outrunStyles[navPos];
        }

        if(props.theme === CYBERPUNK_THEME && cyberpunkStyles[navPos]){
            return ' ' + cyberpunkStyles[navPos];
        }

        if(props.theme === COZY_THEME && cozyStyles[navPos]){
            return ' ' + cozyStyles[navPos];
        }

        if(props.theme === SKELETON_THEME && skeletonStyles[navPos]){
            return ' ' + skeletonStyles[navPos];
        }

        if(props.theme === NEWSPAPER_THEME && newspaperStyles[navPos]){
            return ' ' + newspaperStyles[navPos];
        }

        if(props.theme === CLOVER_THEME && cloverStyles[navPos]){
            return ' ' + cloverStyles[navPos];
        }

        return "";
    }

    return (
        <div className={sidebarStyles.sidebarContainer} id={props.portal}>
            <OutsideChildren />
            {props.outsideChildren}
            <div className={sidebarStyles.sidebar + themeBackground()} ref={containerRef}>
                {props.children}
            </div>
        </div>
    );
}

Sidebar.propTypes = {
    direction: PropTypes.string,
    theme: PropTypes.string,
    outsideChildren: PropTypes.element,
}

Sidebar.defaultProps = {
    direction: "left",
    theme: null,
    outsideChildren: null,
}

const mapStateToProps = state => {
    const { auth, notifications } = state;
    return { auth: auth, notifications: notifications };
};

export default connect(mapStateToProps)(Sidebar);
