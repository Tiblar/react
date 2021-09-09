// @flow

import React, {useEffect, useRef} from "react";
import { connect } from "react-redux";
import PerfectScrollbar from "perfect-scrollbar";

import rightSidebarStyles  from "../../../../../../../css/layout/social/nav/right.css";
import sidebarStyles from "../../../../../../../css/layout/social/nav/sidebar.css";
import layoutStyles from "../../../../../../../css/layout.css";
import outrunStyles from "../../../../../../../css/themes/outrun-theme.css";
import cyberpunkStyles from "../../../../../../../css/themes/cyberpunk-theme.css";
import cozyStyles from "../../../../../../../css/themes/cozy-theme.css";
import skeletonStyles from "../../../../../../../css/themes/skeleton-theme.css";
import cloverStyles from "../../../../../../../css/themes/clover-theme.css";

import Badges from "./profile/Badges";
import Discord from "./profile/Discord";

import {useProfileState} from "../../../profile/context";
import {
    CLOVER_THEME,
    COZY_THEME,
    CYBERPUNK_THEME,
    OUTRUN_THEME,
    SKELETON_THEME
} from "../../../../../../../util/constants";

function ProfileNav() {
    const { user } = useProfileState();

    const containerRef = useRef();
    const scrollRef = useRef();

    useEffect(() => {
        scrollRef.current = new PerfectScrollbar(containerRef.current, {
            suppressScrollX: true
        });
    }, []);

    function themeBackground() {
        if(user === null){
            return "";
        }

        if(user.info.profile_theme === OUTRUN_THEME){
            return ' ' + outrunStyles.rightNav;
        }

        if(user.info.profile_theme === CYBERPUNK_THEME){
            return ' ' + cyberpunkStyles.rightNav;
        }

        if(user.info.profile_theme === COZY_THEME){
            return ' ' + cozyStyles.rightNav;
        }

        if(user.info.profile_theme === SKELETON_THEME){
            return ' ' + skeletonStyles.rightNav;
        }

        if(user.info.profile_theme === CLOVER_THEME){
            return ' ' + cloverStyles.rightNav;
        }

        return "";
    }

    return (
        <div className={sidebarStyles.sidebarContainer + ' ' + rightSidebarStyles.sidebarContainer}>
            <div className={sidebarStyles.sidebar + ' ' + rightSidebarStyles.sidebar + themeBackground()} ref={containerRef}>
                <div className={layoutStyles.mB1}>
                    {
                        user !== null &&
                        <Badges user={user} />
                    }
                    {
                        user !== null &&
                        <Discord user={user} />
                    }
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth };
};

export default connect(mapStateToProps)(ProfileNav);
