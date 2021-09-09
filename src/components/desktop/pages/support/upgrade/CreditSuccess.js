// @flow

import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";

import supportStyles from "../../../../../css/layout/support/support.css";
import cardStyles from "../../../../../css/components/card.css";
import formStyles from "../../../../../css/form.css";
import layoutStyles from "../../../../../css/layout.css";

import Container from "../../../layout/parts/support/Container";

import BoostGraphic from "../../../../../assets/graphics/rocket.svg";

import {MAX_MOBILE_WIDTH, SUPPORT_URL} from "../../../../../util/constants";
import useWindowDimensions from "../../../../../util/hooks/useWindowDimensions";

function PayPalSuccess(props) {
    const {width} = useWindowDimensions();

    return (
        <Container>
            <div className={supportStyles.body} style={{maxWidth: "800px", marginLeft: "auto", marginRight: "auto"}}>
                <div className={cardStyles.card}>
                    <div className={cardStyles.cardHeader}>
                        <b>Thanks for boosting!</b>
                    </div>
                    {
                        MAX_MOBILE_WIDTH > width &&
                        <div className={cardStyles.cardBody + ' ' + layoutStyles.justifyContentCenter}>
                            <div className={layoutStyles.flex + ' ' + layoutStyles.flexColumn + ' ' + layoutStyles.alignItemsCenter}>
                                <BoostGraphic style={{width: "350px"}} />
                                <div className={formStyles.alert + ' ' + layoutStyles.mT2}>
                                    <p>Thanks for boosting, your account should now be boosted. If your account isn't boosted after a few hours, <Link to={SUPPORT_URL}>contact support</Link>. You may need to refresh.</p>
                                </div>
                            </div>
                        </div>
                    }
                    {
                        MAX_MOBILE_WIDTH <= width &&
                        <div className={cardStyles.cardBody}>
                            <div className={layoutStyles.flex}>
                                <BoostGraphic style={{width: "350px"}} />
                                <div className={layoutStyles.mL2}>
                                    <div className={formStyles.alert}>
                                        <p>Thanks for boosting, your account should now be boosted. If your account isn't boosted after a few hours, <Link to={SUPPORT_URL}>contact support</Link>. You may need to refresh.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </Container>
    );
}

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth };
};

export default connect(mapStateToProps)(PayPalSuccess);
