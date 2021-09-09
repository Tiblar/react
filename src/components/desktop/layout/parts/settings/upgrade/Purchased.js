// @flow

import React, {useState} from "react";

import { tier } from "../../../../../../css/layout/social/settings/pages/upgrade.css";
import formStyles from "../../../../../../css/form.css";
import layoutStyles from "../../../../../../css/layout.css";

import BoostGraphic from "../../../../../../assets/graphics/rocket.svg";

import Financials from "../../../../pages/settings/Financials";

import {LAYER, useLayerDispatch} from "../../../layer/context";
import {Link} from "react-router-dom";
import {PAYPAL_CANCEL_URL} from "../../../../../../util/constants";

function Purchased(props) {
    const dispatchLayer = useLayerDispatch();

    const [manager, setManager] = useState({
        warning: false,
        cancelWarning: false,
    })

    function handleFinancialSection() {
        dispatchLayer({ type: LAYER, payload: <Financials /> });
    }

    function handleWarning() {
        setManager(manager => ({
            ...manager,
            warning: !manager.warning,
        }))
    }

    function handleCancelWarning() {
        setManager(manager => ({
            ...manager,
            cancelWarning: !manager.cancelWarning,
        }))
    }

    if(manager.warning){
        return (
            <div className={tier}>
                <h2>Modify Boost</h2>
                <div className={layoutStyles.wF}>
                    <div className={formStyles.alert + ' ' + layoutStyles.mT1}>
                        <div>
                            <p>
                                If you are using PayPal, <Link target="_blank" to={PAYPAL_CANCEL_URL}>cancel your existing subscription</Link>.
                            </p>
                            <hr />
                            <p>
                                If you are using a card or cryptocurrency, cancel your plan in the financial section.
                            </p>
                        </div>
                    </div>
                    <div className={formStyles.alert + ' ' + layoutStyles.mT1}>
                        <p>
                            After your plan is canceled you can select a new boost plan.
                        </p>
                    </div>
                </div>
                <div className={layoutStyles.flex + ' ' + layoutStyles.wF + ' ' + layoutStyles.mT1}>
                    <button className={formStyles.button + ' ' + layoutStyles.flexGrow} onClick={handleFinancialSection}>
                        Cancel
                    </button>
                    <button className={formStyles.button + ' ' + layoutStyles.flexGrow + ' ' + layoutStyles.mL1} onClick={handleWarning}>
                        Back
                    </button>
                </div>
            </div>
        );
    }

    if(manager.cancelWarning){
        return (
            <div className={tier}>
                <h2>Cancel Boost</h2>
                <div className={layoutStyles.wF}>
                    <div className={formStyles.alert + ' ' + layoutStyles.mT1}>
                        <div>
                            <p>
                                To cancel your plan go to the financial section and choose your plan. Then click cancel under the payment method.
                            </p>
                        </div>
                    </div>
                    <div className={formStyles.alert + ' ' + layoutStyles.mT1}>
                        <p>
                            After  your plan is cancelled and your boost plan runs out, any storage over 0.5 GB will be removed within 2 weeks.
                        </p>
                    </div>
                </div>
                <div className={layoutStyles.flex + ' ' + layoutStyles.wF + ' ' + layoutStyles.mT1}>
                    <button className={formStyles.button + ' ' + layoutStyles.flexGrow} onClick={handleFinancialSection}>
                        Cancel
                    </button>
                    <button className={formStyles.button + ' ' + layoutStyles.flexGrow + ' ' + layoutStyles.mL1} onClick={handleCancelWarning}>
                        Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={tier}>
            <h2>Boost</h2>
            <div className={layoutStyles.wF + ' ' + layoutStyles.flex + ' ' + layoutStyles.justifyContentCenter + ' ' + layoutStyles.mT1}>
                <BoostGraphic style={{width: "150px"}} />
            </div>
            <div className={layoutStyles.wF}>
                <div className={formStyles.alert + ' ' + layoutStyles.mT1}>
                    Thank you for purchasing Formerly Chuck's Boost!
                </div>
            </div>
            <div className={layoutStyles.flex + ' ' + layoutStyles.wF + ' ' + layoutStyles.mT1}>
                <button className={formStyles.button + ' ' + layoutStyles.flexGrow} onClick={handleWarning}>
                    Modify Plan
                </button>
                <button className={formStyles.button + ' ' + layoutStyles.flexGrow + ' ' + layoutStyles.mL1} onClick={handleCancelWarning}>
                    Cancel Plan
                </button>
            </div>
            <div className={layoutStyles.mT1}>
                <p>
                    <small>To see billing information/to cancel see the financial section.</small>
                </p>
            </div>
        </div>
    );
}

export default Purchased;
