// @flow

import React from "react";

import cardStyles from "../../../../../../css/components/card.css";
import layoutStyles from "../../../../../../css/layout.css";
import formStyles from "../../../../../../css/form.css";
import errorCardStyles from "../../../../../../css/layout/social/error-card.css";

import BlockedGraphic from "../../../../../../assets/graphics/blocked.svg";
import FrownIcon from "../../../../../../assets/svg/icons/frown.svg";

function Blocked() {
    return (
        <div className={cardStyles.card + ' ' + errorCardStyles.popupShow}>
            <div className={cardStyles.cardBody}>
                <BlockedGraphic width="100%" />
                <hr className={layoutStyles.mT1 + ' ' + layoutStyles.mB1} />
                <div className={formStyles.alert}>
                    <FrownIcon height={20} />You have been blocked by this user.
                </div>
            </div>
        </div>
    );
}

export default Blocked;
