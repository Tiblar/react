// @flow

import React, {useState, useRef, useEffect} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import axios from "axios";

import layoutStyles from "../../../../../../../css/layout.css";
import formStyles from "../../../../../../../css/form.css";
import cardStyles from "../../../../../../../css/components/card.css";
import cardSelectorStyles from "../../../../../../../css/layout/social/settings/card.css";
import financialStyles from "../../../../../../../css/layout/social/settings/pages/financials.css";

import CreditCardIcon from "../../../../../../../assets/emojis/1f4b3.svg";
import LoadingGraphic from "../../../../../../../assets/loading/dots.svg";
import CircleLoading from "../../../../../../../assets/loading/circle-loading.svg";

import {
    API_URL,
    PAYMENT_METHOD_CREDIT_CARD_STRIPE,
    STRIPE_PK, SUCCESSFUL_BOOST_URL_CREDIT_CARD
} from "../../../../../../../util/constants";
import validateEmail from "../../../../../../../util/validateEmail";

function StripeButton(props) {

    const stripeRef = useRef();
    const _isMounted = useRef(true);

    const [manager, setManager] = useState({
        show: false,
        loading: false,
        order: null,
        cardElement: null,
        validCreditCard: false,
        creditCardError: null,
        name: "",
        email: "",
        validEmail: null,
        sending: false,
    });

    useEffect(() => {
        return () => {
            _isMounted.current = false
        }
    }, []);

    useEffect(() => {
        if(!stripeRef.current && typeof Stripe !== 'undefined'){
            stripeRef.current = new Stripe(STRIPE_PK);
        }

        setTimeout(() => {
            if(_isMounted.current && !stripeRef.current){
                stripeRef.current = new Stripe(STRIPE_PK);
            }
        }, 750);
    }, [stripeRef.current]);

    useEffect(() => {
        if(stripeRef.current && manager.show){
            let elements = stripeRef.current.elements();

            let card =
                elements.create('card', { style: {
                        base: {
                            iconColor: getComputedStyle(window.__theme_root).getPropertyValue('--text-muted'),
                            fontSize: '16px',
                            color: getComputedStyle(window.__theme_root).getPropertyValue('--text-normal'),
                            '::placeholder': {
                                color: getComputedStyle(window.__theme_root).getPropertyValue('--text-placeholder'),
                            },
                        },
                        invalid: {
                            color: '#eb4949',
                        },
                    } });

            card.mount("#card-element");

            card.on('change', event => {
                setManager(manager => ({
                    ...manager,
                    validCreditCard: event.complete,
                    creditCardError: event.error ? event.error.message : null,
                }));
            })

            setManager(manager => ({
                ...manager,
                cardElement: card,
            }));
        }
    }, [manager.show, stripeRef.current]);

    useEffect(() => {
        if(manager.email){
            setManager(manager => ({
                ...manager,
                validEmail: validateEmail(manager.email),
            }));
        }else{
            setManager(manager => ({
                ...manager,
                validEmail: null,
            }));
        }
    }, [manager.email]);

    function handleClick() {
        props.setPaymentMethod(PAYMENT_METHOD_CREDIT_CARD_STRIPE);

        setManager(manager => ({
            ...manager,
            show: true,
        }));
    }

    async function handlePay() {
        if(manager.sending){
            return;
        }
        setManager(manager => ({
            ...manager,
            sending: true,
        }))

        let result = await stripeRef.current.createPaymentMethod({
            type: 'card',
            card: manager.cardElement,
            billing_details: {
                name: manager.name,
                email: manager.email,
            }
        });

        if(result.error){
            setManager(manager => ({
                ...manager,
                validCreditCard: false,
                creditCardError: result.error,
            }));

            return;
        }

        createSubscription(result.paymentMethod.id);
    }

    function createSubscription(paymentMethodId) {

        if(manager.sending){
            return;
        }

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        const params = {
            payment_method: PAYMENT_METHOD_CREDIT_CARD_STRIPE,
            stripe_payment_method_id: paymentMethodId,
            attributes: props.attributes,
            frequency: props.frequency,
        }

        axios.post(API_URL + `/market/product/${props.product.id}/purchase`, params, config)
            .then(function (res) {
                window.location.replace(SUCCESSFUL_BOOST_URL_CREDIT_CARD);
            })
            .catch(function (err) {
                setManager((manager) => ({
                    ...manager,
                    loading: false,
                    error: true
                }));
            });
    }

    function handleEmail(e) {
        let value = e.target.value;

        setManager(manager => ({
            ...manager,
            email: value,
        }));
    }

    function handleName(e) {
        let value = e.target.value;

        setManager(manager => ({
            ...manager,
            name: value,
        }));
    }

    return (
        <div>
            {
                manager.show &&
                <div className={cardStyles.card}>
                    <div className={cardStyles.cardHeader}>
                        <h4>Credit or debit card</h4>
                    </div>
                    <div className={cardStyles.cardBody}>
                        <div className={formStyles.formGroup + ' ' + layoutStyles.mTN}>
                            {
                                manager.email && !manager.validEmail &&
                                <label className={formStyles.invalidInput + ' ' + formStyles.invalidLabel}>
                                    Invalid email
                                </label>
                            }
                            {
                                (!manager.email || manager.validEmail) &&
                                <label>Email</label>
                            }
                            <input className={formStyles.input + ((manager.email && !manager.validEmail) ? ' ' + formStyles.invalidInput : '')}
                                   value={manager.email}
                                   onChange={handleEmail}
                                   type="email"
                                   placeholder="Email address" />
                        </div>
                        <div className={formStyles.formGroup + ' ' + layoutStyles.mTN}>
                            <label>Full name</label>
                            <input className={formStyles.input}
                                   value={manager.name}
                                   onChange={handleName}
                                   type="text"
                                   placeholder="Full name on card" />
                        </div>
                        <div className={formStyles.formGroup}>
                            {
                                manager.creditCardError &&
                                <label className={formStyles.invalidInput + ' ' + formStyles.invalidLabel}>
                                    This is an error
                                </label>
                            }
                            {
                                !manager.creditCardError &&
                                <label className={formStyles.invalidInput + ' ' + formStyles.danger}>
                                    Card
                                </label>
                            }
                            <div className={financialStyles.creditCard + ' ' + formStyles.input + (manager.creditCardError ? ' ' + formStyles.invalidInput : '')}>
                                <div className={layoutStyles.flexGrow} id="card-element">

                                </div>
                            </div>
                        </div>
                        <div className={layoutStyles.mT1}>
                            <button className={formStyles.button + ' ' + formStyles.buttonPrimary + ' ' + formStyles.buttonIcon}
                                    onClick={handlePay}
                                    disabled={!manager.validCreditCard || (!manager.validEmail || !manager.email) || !manager.name}>
                                {
                                    manager.sending &&
                                    <CircleLoading width={21} />
                                }
                                {
                                    !manager.sending && "Pay Now"
                                }
                            </button>
                        </div>
                    </div>
                </div>
            }
            {
                manager.loading &&
                <LoadingGraphic width={45} height={45} />
            }
            {
                (!manager.loading && !manager.show) &&
                <div className={cardSelectorStyles.cardSelector}
                     onClick={handleClick}
                     style={{maxWidth: "250px", marginTop: "0.25rem"}}>
                    <CreditCardIcon width={30} height={30} />
                    <p>Card</p>
                </div>
            }
        </div>
    );
};

const mapStateToProps = (state) => {
    const { auth } = state;
    return { auth: auth };
};

StripeButton.propTypes = {
    setPaymentMethod: PropTypes.func,
    frequency: PropTypes.string,
    product: PropTypes.object,
    attributes: PropTypes.object,
}

export default connect(mapStateToProps)(StripeButton);
