// @flow

import React, {useState, useEffect} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";

import layoutStyles from "../../../../../../css/layout.css";
import cardStyles from "../../../../../../css/components/card.css";
import modalStyles from "../../../../../../css/components/modal.css";
import radioStyles from "../../../../../../css/components/radio.css";

import PayPalButton from "./buttons/PayPalButton";
import StripeButton from "./buttons/StripeButton";

import {
    PAYMENT_METHOD_CREDIT_CARD_STRIPE,
    PAYMENT_METHOD_CRYPTOCURRENCY,
    PAYMENT_METHOD_PAYPAL,
    PAYMENT_FREQUENCY_MONTHLY, PAYMENT_FREQUENCY_ANNUALLY,
} from "../../../../../../util/constants";
import {price} from "../../../../../../util/formatNumber";
import CryptoButton from "./buttons/CryptoButton";


function Summary(props) {
    const [manager, setManager] = useState({
        paymentMethod: null,
        frequency: null
    });

    useEffect(() => {
        if(props.product.subscription_frequency !== null){
            setManager(manager => ({
                ...manager,
                frequency: PAYMENT_FREQUENCY_MONTHLY
            }));
        }
    }, []);

    function setPaymentMethod(method) {
        setManager(manager => ({
            ...manager,
            paymentMethod: method,
        }));
    }

    let total = props.product.price;

    return (
        <div className={modalStyles.body}>
            {
                props.product.description &&
                <div className={layoutStyles.alert}>
                    {props.product.description}
                </div>
            }
            <div className={cardStyles.card + ' ' + layoutStyles.mT1}>
                <div className={cardStyles.cardHeader}>
                    Your cart
                </div>
                <div className={cardStyles.cardBody}>
                    <ul className={layoutStyles.mN} style={{paddingLeft: "calc(1rem + 10px)"}}>
                        <li>{props.product.title} - {price(props.product.price)} {props.product.currency}</li>
                        {Object.keys(props.attributes).map((id) => {
                            for(let attribute of props.product.attributes){
                                if(attribute.id === id){
                                    total += (attribute.price * props.attributes[id]);

                                    return (
                                        <li key={id}>
                                            {attribute.title} - {price(attribute.price)} {props.product.currency} x {props.attributes[id]}
                                        </li>
                                    );
                                }
                            }

                            return null;
                        })}
                    </ul>
                </div>
                {
                    props.product.subscription_frequency !== null &&
                    <div className={cardStyles.cardFooter}>
                        <label>
                            <input name="view"
                                   checked={manager.frequency === PAYMENT_FREQUENCY_MONTHLY}
                                   onChange={() => {
                                       setManager(manager => ({
                                           ...manager,
                                           frequency: PAYMENT_FREQUENCY_MONTHLY
                                       }))
                                   }}
                                   disabled={manager.paymentMethod && manager.frequency !== PAYMENT_FREQUENCY_MONTHLY}
                                   className={radioStyles.withGap}
                                   type="radio" />
                            <span>Monthly</span>
                        </label>
                        <label>
                            <input name="view"
                                   checked={manager.frequency === PAYMENT_FREQUENCY_ANNUALLY}
                                   onChange={() => {
                                       setManager(manager => ({
                                           ...manager,
                                           frequency: PAYMENT_FREQUENCY_ANNUALLY
                                       }))
                                   }}
                                   disabled={manager.paymentMethod && manager.frequency !== PAYMENT_FREQUENCY_ANNUALLY}
                                   className={radioStyles.withGap}
                                   type="radio" />
                            {
                                props.product.annual_discount !== null && props.product.annual_discount > 0 &&
                                <span>Annually ({props.product.annual_discount}% discount)</span>
                            }
                            {
                                props.product.annual_discount === null &&
                                <span>Annually</span>
                            }
                        </label>
                    </div>
                }
                {
                    manager.frequency !== PAYMENT_FREQUENCY_ANNUALLY &&
                    <div className={cardStyles.cardFooter}>
                        <p><b>Total:</b>&nbsp;{price(total)}&nbsp;{props.product.currency}</p>
                    </div>
                }
                {
                    manager.frequency === PAYMENT_FREQUENCY_ANNUALLY &&
                    <div className={cardStyles.cardFooter}>
                        <p><b>Total:</b>&nbsp;{price(total * ((100 - props.product.annual_discount)/100) * 12)}&nbsp;{props.product.currency}</p>
                    </div>
                }
            </div>
            <div className={layoutStyles.mT1 + ' ' + layoutStyles.flex + ' ' + layoutStyles.flexColumn}>
                {
                    !manager.paymentMethod &&
                    <b className={layoutStyles.mB1}>Select payment method:</b>
                }
                {
                    (!manager.paymentMethod || manager.paymentMethod === PAYMENT_METHOD_CREDIT_CARD_STRIPE) &&
                    <StripeButton
                        setPaymentMethod={setPaymentMethod}
                        product={props.product}
                        attributes={props.attributes}
                        frequency={manager.frequency} />
                }
                {
                /*
                {
                    (!manager.paymentMethod || manager.paymentMethod === PAYMENT_METHOD_PAYPAL) &&
                    <PayPalButton
                        setPaymentMethod={setPaymentMethod}
                        product={props.product}
                        attributes={props.attributes}
                        frequency={manager.frequency} />
                }
                {
                    (!manager.paymentMethod || manager.paymentMethod === PAYMENT_METHOD_CRYPTOCURRENCY) &&
                    <CryptoButton
                        setPaymentMethod={setPaymentMethod}
                        product={props.product}
                        attributes={props.attributes}
                        frequency={manager.frequency} />
                }
                */
                }
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    const { auth } = state;
    return { auth: auth };
};

Summary.propTypes = {
    product: PropTypes.object,
    attributes: PropTypes.object,
}

export default connect(mapStateToProps)(Summary);
