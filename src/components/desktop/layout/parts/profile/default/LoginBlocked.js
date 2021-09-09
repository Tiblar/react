// @flow

import React from "react";
import {Link} from "react-router-dom";

import cardStyles from "../../../../../../css/components/card.css";
import layoutStyles from "../../../../../../css/layout.css";
import formStyles from "../../../../../../css/form.css";
import errorCardStyles from "../../../../../../css/layout/social/error-card.css";

import BlockedGraphic from "../../../../../../assets/graphics/auth.svg";

function LoginBlocked() {
    return (
        <div className={cardStyles.card + ' ' + errorCardStyles.popupShow}>
            <div className={cardStyles.cardBody}>
                <BlockedGraphic width="100%" />
                <hr className={layoutStyles.mT1 + ' ' + layoutStyles.mB1} />
                <div className={formStyles.alert}>
                    You need to login to view this user.
                    <Link to={`/login`} className={formStyles.button + ' ' + formStyles.buttonPrimary + ' ' + layoutStyles.mL}>
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default LoginBlocked;
