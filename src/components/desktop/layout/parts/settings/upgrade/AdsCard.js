// @flow

import React from "react";

import formStyles from "../../../../../../css/form.css";
import layoutStyles from "../../../../../../css/layout.css";
import cardStyles from "../../../../../../css/layout/social/settings/card.css";

import PlusIcon from "../../../../../../assets/svg/icons/plus.svg";

function AdsCard(props) {
    return (
        <div className={cardStyles.card}>
            <div className={cardStyles.cardTitle}>
                <p>Enable ads to support the site.</p>
                <p className={formStyles.small + " " + formStyles.muted + " " + layoutStyles.mL}>* Coming soon</p>
            </div>
            <div className={cardStyles.cardBody}>
                <p>
                    If you want to support the site by enabling ads, click the
                    button below. You can turn this off at any time.
                </p>
            </div>
            <div className={cardStyles.cardFooter}>
                <button
                    disabled="disabled"
                    className={formStyles.button + " " + formStyles.buttonSuccess}
                >
                    <PlusIcon height="15" />
                    Enable Ads
                </button>
            </div>
        </div>
    );
}

export default AdsCard;
