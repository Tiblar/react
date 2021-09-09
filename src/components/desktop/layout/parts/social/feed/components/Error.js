// @flow

import React from "react";

import cardStyles from "../../../../../../../css/components/card.css";
import layoutStyles from "../../../../../../../css/layout.css";
import errorCardStyles from "../../../../../../../css/layout/social/error-card.css";

import ErrorGraphic from "../../../../../../../assets/graphics/post-error.svg";
import {STATUS_URL} from "../../../../../../../util/constants";

function Error() {
    return (
        <div className={cardStyles.card + ' ' + errorCardStyles.popupShow}>
            <div className={cardStyles.cardBody}>
                <ErrorGraphic width="100%" />
                <hr className={layoutStyles.mT1 + ' ' + layoutStyles.mB1} />
                <p>It looks like there was an error.</p>
                <ul>
                    <li>Refresh the page</li>
                    <li>Check the <a target="_blank" href={STATUS_URL}>status page</a></li>
                    <li>If it continues, <a target="_blank" href="/support">contact support</a></li>
                    <li>Check your internet connection</li>
                </ul>
            </div>
        </div>
    );
}

export default Error;
