// @flow

import React, {useState, useRef, useEffect} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import axios from "axios";

import layoutStyles from "../../../../../../../css/layout.css";
import cardSelectorStyles from "../../../../../../../css/layout/social/settings/card.css";

import PayPalIcon from "../../../../../../../assets/svg/logos/paypal-rect.svg";
import LoadingGraphic from "../../../../../../../assets/loading/dots.svg";

import {
    API_URL, PAYMENT_METHOD_PAYPAL, PAYPAL_GATEWAY,
    PAYMENT_FREQUENCY_ANNUALLY, PAYMENT_FREQUENCY_MONTHLY, WEB_URL,
    SUCCESSFUL_BOOST_URL_PAYPAL, PAYPAL_FORMERLY_CHUCKS_IPN
} from "../../../../../../../util/constants";

function PayPalButton(props) {

    const ref = useRef();

    const [manager, setManager] = useState({
        loading: false,
        order: null,
    });

    useEffect(() => {
        if(!manager.order || !manager.order.id){
            return;
        }

        ref.current.submit();
    }, [manager.order]);

    function handleClick() {
        props.setPaymentMethod(PAYMENT_METHOD_PAYPAL);

        setManager(manager => ({
            ...manager,
            loading: true,
        }));

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        const params = {
            payment_method: PAYMENT_METHOD_PAYPAL,
            attributes: props.attributes,
            frequency: props.frequency,
        }

        axios.post(API_URL + `/market/product/${props.product.id}/purchase`, params, config)
            .then(function (res) {
                if(res.data && res.data.data.order){
                    setManager((manager) => ({
                        ...manager,
                        loading: false,
                        order: res.data.data.order
                    }));
                }else{
                    setManager((manager) => ({
                        ...manager,
                        loading: false,
                        error: true
                    }));
                }
            })
            .catch(function (err) {
                setManager((manager) => ({
                    ...manager,
                    loading: false,
                    error: true
                }));
            });
    }

    function parseFrequency(frequency) {
        if(frequency === PAYMENT_FREQUENCY_ANNUALLY){
            return "Y";
        }

        if(frequency === PAYMENT_FREQUENCY_MONTHLY){
            return "M";
        }
    }

    return (
        <div>
            {
                manager.order &&
                <form action={PAYPAL_GATEWAY} ref={ref} method="post" className={layoutStyles.hide}>
                    <input type="hidden" name="business" value={manager.order.product.seller_paypal} />
                    <input type="hidden" name="cmd" value="_xclick-subscriptions" />
                    <input type="hidden" name="item_namex" value={manager.order.product.title} />
                    <input type="hidden" name="item_numberx" value={manager.order.product.id} />
                    <input type="hidden" name="currency_code" value={manager.order.product.currency} />
                    <input id="paypal-amount" type="hidden" name="a3" value={manager.order.price} />
                    <input type="hidden" name="p3" value="1" />
                    {
                        manager.order.recurring &&
                        <input type="hidden" name="t3" value={parseFrequency(manager.order.frequency)} />
                    }
                    <input type="hidden" name="sra" value={manager.order.recurring ? "1" : "0"} />
                    <input type="hidden" name="src" value="1" />
                    <input type="hidden" name="no_shipping" value={!manager.order.shipping ? "1" : "0"}/>
                    <input type="hidden" name="custom" value={manager.order.id} />
                    <input type="hidden" name="cancel_return" value={WEB_URL} />
                    <input type="hidden" name="return" value={SUCCESSFUL_BOOST_URL_PAYPAL} />
                    <input type="hidden" name="notify_url" value={PAYPAL_FORMERLY_CHUCKS_IPN} />
                </form>
            }
            {
                (manager.loading || manager.order) &&
                <LoadingGraphic width={45} height={45} />
            }
            {
                (!manager.loading && !manager.order) &&
                <div className={cardSelectorStyles.cardSelector}
                     onClick={handleClick}
                     style={{maxWidth: "250px", marginTop: "0.25rem"}}>
                    <PayPalIcon width={30} height={30} />
                    <p>PayPal</p>
                </div>
            }
        </div>
    );
};

const mapStateToProps = (state) => {
    const { auth } = state;
    return { auth: auth };
};

PayPalButton.propTypes = {
    setPaymentMethod: PropTypes.func,
    frequency: PropTypes.string,
    product: PropTypes.object,
    attributes: PropTypes.object,
}

export default connect(mapStateToProps)(PayPalButton);
