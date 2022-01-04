// @flow

import React, {useState} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";

import cardSelectorStyles from "../../../../../../../css/layout/social/settings/card.css";
import upgradeStyles from "../../../../../../../css/layout/social/settings/pages/upgrade.css";

import BitcoinIcon from "../../../../../../../assets/svg/icons/bitcoin.svg";
import MoneroIcon from "../../../../../../../assets/svg/icons/monero.svg";
import LitecoinIcon from "../../../../../../../assets/svg/icons/litecoin.svg";
import BitcoinCashIcon from "../../../../../../../assets/svg/icons/bitcoin-cash.svg";
import TetherIcon from "../../../../../../../assets/svg/icons/tether.svg";
import USDCIcon from "../../../../../../../assets/svg/icons/usdc.svg";
import DogeIcon from "../../../../../../../assets/svg/icons/dogecoin.svg";
import CryptoIcon from "../../../../../../../assets/svg/icons/lock.svg";

import {
    PAYMENT_METHOD_CRYPTOCURRENCY, PAYMENT_METHOD_BITCOIN, PAYMENT_METHOD_MONERO, PAYMENT_METHOD_LITECOIN,
    PAYMENT_METHOD_BITCOIN_CASH, PAYMENT_METHOD_TETHER, PAYMENT_METHOD_USD_COIN, PAYMENT_METHOD_DOGE
} from "../../../../../../../util/constants";
import Crypto from "./Crypto";

function CryptoButton(props) {

    const [manager, setManager] = useState({
        paymentMethod: null,
        active: false,
    });

    function handleClick() {
        setManager(manager => ({
            ...manager,
            active: true,
        }));
    }

    function setCrypto(method) {
        props.setPaymentMethod(method ? PAYMENT_METHOD_CRYPTOCURRENCY : null);

        setManager(manager => ({
            ...manager,
            paymentMethod: method,
        }));
    }

    if(manager.paymentMethod) {
        return (
            <Crypto setCrypto={setCrypto}
                    frequency={props.frequency}
                    attributes={props.attributes}
                    product={props.product}
                    payment_method={manager.paymentMethod} />
        );
    }

    return (
        <div className={upgradeStyles.cryptoList}>
            {
                manager.active &&
                <>
                    <div className={cardSelectorStyles.cardSelector + ' ' + upgradeStyles.item}
                         onClick={() => { setCrypto(PAYMENT_METHOD_MONERO) }}>
                        <MoneroIcon width={30} height={30} />
                        <p>Monero</p>
                    </div>
                    <div className={cardSelectorStyles.cardSelector + ' ' + upgradeStyles.item}
                         onClick={() => { setCrypto(PAYMENT_METHOD_BITCOIN) }}>
                        <BitcoinIcon width={30} height={30} />
                        <p>Bitcoin</p>
                    </div>
                    <div className={cardSelectorStyles.cardSelector + ' ' + upgradeStyles.item}
                         onClick={() => { setCrypto(PAYMENT_METHOD_LITECOIN) }}>
                        <LitecoinIcon width={30} height={30} />
                        <p>Litecoin</p>
                    </div>
                    <div className={cardSelectorStyles.cardSelector + ' ' + upgradeStyles.item}
                         onClick={() => { setCrypto(PAYMENT_METHOD_BITCOIN_CASH) }}>
                        <BitcoinCashIcon width={30} height={30} />
                        <p>Bitcoin Cash</p>
                    </div>
                    <div className={cardSelectorStyles.cardSelector + ' ' + upgradeStyles.item}
                         onClick={() => { setCrypto(PAYMENT_METHOD_TETHER) }}>
                        <TetherIcon width={30} height={30} />
                        <p>Tether (TRON)</p>
                    </div>
                    <div className={cardSelectorStyles.cardSelector + ' ' + upgradeStyles.item}
                         onClick={() => { setCrypto(PAYMENT_METHOD_USD_COIN) }}>
                        <USDCIcon width={30} height={30} />
                        <p>USD Coin (TRON)</p>
                    </div>
                    <div className={cardSelectorStyles.cardSelector + ' ' + upgradeStyles.item}
                         onClick={() => { setCrypto(PAYMENT_METHOD_DOGE) }}>
                        <DogeIcon width={30} height={30} />
                        <p>Doge</p>
                    </div>
                </>
            }
            {
                !manager.active &&
                <div className={cardSelectorStyles.cardSelector + ' ' + upgradeStyles.item} onClick={handleClick}>
                    <CryptoIcon width={30} height={20} />
                    <p>Cryptocurrency</p>
                </div>
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
