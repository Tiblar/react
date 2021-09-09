// @flow

import React, {useEffect, useRef} from "react";
import PerfectScrollbar from "perfect-scrollbar";
import {Link} from "react-router-dom";

import {
    mB1, m1
} from "../../../../../../../css/layout.css";
import sidebarStyles from "../../../../../../../css/layout/social/nav/sidebar.css";
import rightSidebarStyles from "../../../../../../../css/layout/social/nav/right.css";
import cardStyles from "../../../../../../../css/components/card.css";
import formStyles from "../../../../../../../css/form.css";
import leaderboardStyles from "../../../../../../../css/layout/social/leaderboard.css";

import DeveloperGraphic from "../../../../../../../assets/graphics/developer.svg";

function AccountCenterNav(props) {
    const containerRef = useRef();

    useEffect(() => {
        new PerfectScrollbar(containerRef.current, {
            suppressScrollX: true
        });
    }, []);

    return (
        <div className={sidebarStyles.sidebarContainer + ' ' + rightSidebarStyles.sidebarContainer + ' ' + leaderboardStyles.sidebar}>
            <div className={sidebarStyles.sidebar + ' ' + rightSidebarStyles.sidebar} ref={containerRef}>
                <div className={mB1}>
                    <div className={cardStyles.card + ' ' + m1}>
                        <div className={cardStyles.cardHeader}>
                            <h3>Thank you!</h3>
                        </div>
                        <div className={cardStyles.cardBody}>
                            <DeveloperGraphic />
                        </div>
                    </div>
                </div>
                <div className={formStyles.alert + ' ' + m1}>
                    <p>Thanks for using my website! If you want you can follow my <Link to="/222">account</Link>.</p>
                </div>
            </div>
        </div>
    );
}

export default AccountCenterNav;
