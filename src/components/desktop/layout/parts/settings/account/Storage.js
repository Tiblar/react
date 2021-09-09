// @flow

import React from "react";
import { connect } from "react-redux";

import cardStyles from "../../../../../../css/layout/social/settings/card.css";
import formStyles, {
    button,
} from "../../../../../../css/form.css";
import layoutStyles, {
    mN,
    mB1,
    mT1,
    tbRowM,
    tbCol12
} from "../../../../../../css/layout.css";
import {LAYER, useLayerDispatch} from "../../../layer/context";
import Upgrade from "../../../../pages/settings/Upgrade";

function Storage(props) {
    const dispatchLayer = useLayerDispatch();

    if(props.auth.user === null){
        return null;
    }

    function handleUpgrade() {
        dispatchLayer({ type: LAYER, payload: <Upgrade /> });
    }

    return (
        <div className={tbRowM + " " + mB1 + " " + mT1}>
            <div className={tbCol12}>
                <h4 className={mN}>Storage Used</h4>
                <div className={cardStyles.card + " " + mT1}>
                    <div className={cardStyles.cardBody}>
                        <div className={layoutStyles.mB1}>
                            <div className={formStyles.progress}>
                                <div className={formStyles.bar}
                                     style={{width: Math.floor((props.auth.user.storage/props.auth.user.storage_limit) * 100).toString() + "%"}} />
                            </div>
                        </div>
                        <div className={layoutStyles.flex}>
                            <p className={layoutStyles.small}>
                                You have used {Math.round(props.auth.user.storage * 100) / 100} GB out of {props.auth.user.storage_limit} GB
                            </p>
                            {
                                !props.auth.user.boosted &&
                                <button
                                    className={
                                        formStyles.button + ' ' + formStyles.buttonPrimary + ' ' + formStyles.buttonSmall + ' ' + layoutStyles.mL
                                    }
                                    onClick={handleUpgrade}>
                                    Upgrade
                                </button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth };
};

export default connect(mapStateToProps)(Storage);
