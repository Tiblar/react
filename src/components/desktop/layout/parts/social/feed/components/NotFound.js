// @flow

import React from "react";

import cardStyles from "../../../../../../../css/components/card.css";
import layoutStyles from "../../../../../../../css/layout.css";
import formStyles from "../../../../../../../css/form.css";
import errorCardStyles from "../../../../../../../css/layout/social/error-card.css";

import ErrorGraphic from "../../../../../../../assets/graphics/social/feed-not-found.svg";
import FrownIcon from "../../../../../../../assets/svg/icons/frown.svg";
import useWindowDimensions from "../../../../../../../util/hooks/useWindowDimensions";
import {MAX_MOBILE_WIDTH} from "../../../../../../../util/constants";

function NotFound() {
    const {width} = useWindowDimensions();

    return (
        <div className={(width > MAX_MOBILE_WIDTH ? cardStyles.card + ' ' : "") + errorCardStyles.popupShow}>
            <div className={cardStyles.cardBody}>
                <ErrorGraphic width="100%" />
                <hr className={layoutStyles.mT1 + ' ' + layoutStyles.mB1} />
                <div className={formStyles.alert}>
                    <FrownIcon height={20} />This page does not exist.
                </div>
            </div>
        </div>
    );
}

export default NotFound;
