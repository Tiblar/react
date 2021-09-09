// @flow

import React from "react";

import cardStyles from "../../../../../../css/components/card.css";
import layoutStyles from "../../../../../../css/layout.css";
import formStyles from "../../../../../../css/form.css";
import errorCardStyles from "../../../../../../css/layout/social/error-card.css";

import BannedIcon from "../../../../../../assets/graphics/banned.svg";
import FrownIcon from "../../../../../../assets/svg/icons/frown.svg";

function Banned() {
    return (
        <div className={cardStyles.card + ' ' + errorCardStyles.popupShow}>
            <div className={cardStyles.cardBody}>
                <div className={layoutStyles.flex + ' ' + layoutStyles.justifyContentCenter}>
                    <BannedIcon width="100%" className={layoutStyles.p3} />
                </div>
                <hr className={layoutStyles.mT1 + ' ' + layoutStyles.mB1} />
                <div className={formStyles.alert}>
                    <FrownIcon height={20} />This user has been banned.
                </div>
            </div>
        </div>
    );
}

export default Banned;
