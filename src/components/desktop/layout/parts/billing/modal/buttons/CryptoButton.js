// @flow

import React, {useState} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";

import layoutStyles from "../../../../../../../css/layout.css";
import cardSelectorStyles from "../../../../../../../css/layout/social/settings/card.css";

import BitcoinIcon from "../../../../../../../assets/svg/icons/bitcoin.svg";
import MoneroIcon from "../../../../../../../assets/svg/icons/monero.svg";
import CryptoIcon from "../../../../../../../assets/svg/icons/lock.svg";

import {
    PAYMENT_METHOD_BITCOIN, PAYMENT_METHOD_CRYPTOCURRENCY, PAYMENT_METHOD_MONERO,
} from "../../../../../../../util/constants";
import Crypto from "./Crypto";

function CryptoButton(props) {

    const [manager, setManager] = useState({
        paymentMethod: null,
        active: false,
    });

    function handleClick() {
        props.setPaymentMethod(PAYMENT_METHOD_CRYPTOCURRENCY);

        setManager(manager => ({
            ...manager,
            active: true,
        }));
    }

    function setCrypto(method) {
        setManager(manager => ({
            ...manager,
            paymentMethod: method,
        }));
    }

    return (
        <div>
            {
                manager.paymentMethod &&
                <Crypto frequency={props.frequency}
                        attributes={props.attributes}
                        product={props.product}
                        payment_method={manager.paymentMethod} />
            }
            {
                /*
             {
                (manager.active && !manager.paymentMethod) &&
                <div>
                    <div className={cardSelectorStyles.cardSelector}
                         onClick={() => { setCrypto(PAYMENT_METHOD_MONERO) }}
                         style={{maxWidth: "250px", marginTop: "0.25rem"}}>
                        <MoneroIcon width={30} height={30} />
                        <p>Monero</p>
                    </div>
                    <div className={cardSelectorStyles.cardSelector}
                         onClick={() => { setCrypto(PAYMENT_METHOD_BITCOIN) }}
                         style={{maxWidth: "250px", marginTop: "0.25rem"}}>
                        <BitcoinIcon width={30} height={30} />
                        <p>Bitcoin</p>
                    </div>
                </div>
            }
            {
                !manager.active &&
                <div className={cardSelectorStyles.cardSelector}
                     onClick={handleClick}
                     style={{maxWidth: "250px", marginTop: "0.25rem"}}>
                    <CryptoIcon width={30} height={20} />
                    <p>CryptoCurrency</p>
                </div>
            }
                 */
            }
        </div>
    );
};

const mapStateToProps = (state) => {
    const { auth } = state;
    return { auth: auth };
};

CryptoButton.propTypes = {
    setPaymentMethod: PropTypes.func,
    frequency: PropTypes.string,
    product: PropTypes.object,
    attributes: PropTypes.object,
}

export default connect(mapStateToProps)(CryptoButton);
