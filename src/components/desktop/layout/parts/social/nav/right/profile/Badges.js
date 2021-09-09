// @flow

import React, {useEffect, useRef} from "react";
import { connect } from "react-redux";

import sidebarStyles from "../../../../../../../../css/layout/social/nav/sidebar.css";
import layoutStyles from "../../../../../../../../css/layout.css";
import formStyles from "../../../../../../../../css/form.css";

import FrownIcon from "../../../../../../../../assets/svg/icons/frown.svg";

import {UserType} from "../../../../../../../../util/types/UserTypes";

function Badges(props) {
    return [
        (
            <div key="badges-title" className={sidebarStyles.sidebarItem + ' ' + sidebarStyles.sidebarTitle}>
                <label>Badges</label>
            </div>
        ),
        (
            <div key="badges" className={sidebarStyles.sidebarObject}>
                <div className={layoutStyles.grey}>
                    <div className={formStyles.alert}>
                        <FrownIcon width="18" />
                        {props.user.info.username} has no badges.
                    </div>
                </div>
            </div>
        )
    ]
}

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth };
};

Badges.propTypes = {
    user: UserType.isRequired,
}

export default connect(mapStateToProps)(Badges);
