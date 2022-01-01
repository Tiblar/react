// @flow

import React, {useEffect, useRef, useState} from "react";
import PropTypes from "prop-types";
import axios from "axios";
import {toast} from "react-toastify";
import {isMobile} from "is-mobile";

import cardStyles from "../../../../../../css/components/card.css";
import layoutStyles from "../../../../../../css/layout.css";
import formStyles from "../../../../../../css/form.css";
import modalStyles from "../../../../../../css/components/modal.css";

import InvoiceOld from "./Invoice";

import CircleLoading from "../../../../../../assets/loading/circle-loading.svg";

import {formatFullDate} from "../../../../../../util/date";
import {price} from "../../../../../../util/formatNumber";
import {
    API_URL, INVOICE_STATUS_PENDING,
    PAYMENT_METHOD_CRYPTO_LIST,
    PAYMENT_METHOD_CREDIT_CARD_STRIPE,
    PAYMENT_METHOD_PAYPAL,
    PAYPAL_CANCEL_URL
} from "../../../../../../util/constants";
import outsideClick from "../../../../../../util/components/outsideClick";

function OrderModal(props) {
    const _isMounted = useRef(true);
    const ref = useRef();

    const [manager, setManager] = useState({
        showAllInvoices: false,
        cancelError: false,
        generatingInvoice: false,
        refreshing: false,
    })

    let order = props.order;
    let paymentMethods = [];

    useEffect(() => {
        return () => {
            _isMounted.current = false
        }
    }, []);

    outsideClick(ref, () => {
        props.close();
    })

    function handleShowAllInvoices() {
        setManager(manager => ({
            ...manager,
            showAllInvoices: true,
        }))
    }

    function handleCancel() {
        if(manager.sending){
            return;
        }

        setManager((manager) => ({
            ...manager,
            sending: true,
        }));

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        axios.delete(API_URL + `/market/order/${order.id}`, config)
            .then(function (res) {
                if(_isMounted.current && res.data && res.data.data.order){
                    props.cancelOrder(res.data.data.order.id);

                    setManager((manager) => ({
                        ...manager,
                        sending: false,
                        cancelError: false
                    }));
                }else{
                    setManager((manager) => ({
                        ...manager,
                        sending: false,
                        cancelError: true
                    }));
                }
            })
            .catch(function (err) {
                setManager((manager) => ({
                    ...manager,
                    sending: false,
                    cancelError: true
                }));
            });
    }

    function handleGenerateInvoice() {
        if(manager.generatingInvoice){
            return;
        }

        setManager((manager) => ({
            ...manager,
            generatingInvoice: true,
        }));

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        axios.post(API_URL + `/market/order/${order.id}/crypto-invoice`, config)
            .then(function (res) {
                if(_isMounted.current && res.data && res.data.data.order){
                    props.updateOrder(res.data.data.order.id, res.data.data.order);

                    setManager((manager) => ({
                        ...manager,
                        generatingInvoice: false,
                        cancelError: false
                    }));
                }else{
                    setManager((manager) => ({
                        ...manager,
                        generatingInvoice: false,
                        cancelError: true
                    }));
                }
            })
            .catch(function (err) {
                setManager((manager) => ({
                    ...manager,
                    generatingInvoice: false,
                    cancelError: true
                }));

                const Notification = () => (
                    <div>
                        There was an error!
                    </div>
                );

                toast.error(<Notification />, {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            });
    }

    function handleRefresh() {
        if(manager.refreshing){
            return;
        }

        setManager((manager) => ({
            ...manager,
            refreshing: true,
        }));

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        axios.get(API_URL + `/market/order/${order.id}`, config)
            .then(function (res) {
                if(_isMounted.current && res.data && res.data.data.order){
                    props.updateOrder(res.data.data.order.id, res.data.data.order);

                    setManager((manager) => ({
                        ...manager,
                        refreshing: false,
                    }));
                }else{
                    setManager((manager) => ({
                        ...manager,
                        refreshing: false,
                    }));
                }
            })
            .catch(function (err) {
                setManager((manager) => ({
                    ...manager,
                    refreshing: false,
                }));

                const Notification = () => (
                    <div>
                        There was an error!
                    </div>
                );

                toast.error(<Notification />, {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            });
    }

    let isCrypto = order.invoices.some(invoice => {
        return PAYMENT_METHOD_CRYPTO_LIST.includes(invoice.payment_method.type)
    });

    let hasActive = order.invoices.some(invoice => {
        return invoice.payment_status === INVOICE_STATUS_PENDING
    });

    return (
        <div className={modalStyles.containerOuter + (isMobile() ? (" " + modalStyles.mobile) : "")}>
            <div className={modalStyles.wrapper}>
                <div className={modalStyles.containerInner}>
                    <div className={modalStyles.modalContainer}>
                        <div className={modalStyles.modal} ref={ref}>
                            <div className={modalStyles.top}>
                                <div className={modalStyles.header}>
                                    <h4>Order #{order.id}</h4>
                                </div>
                            </div>
                            <div className={modalStyles.body}>
                                <div className={layoutStyles.flex}>
                                    <p>{order.product.title}</p>
                                    {
                                        order.recurring && order.active &&
                                        <div className={formStyles.badge + ' ' + layoutStyles.mL1}>
                                            Recurring + Active
                                        </div>
                                    }
                                </div>
                                <p>
                                    <small>{order.product.description}</small>
                                </p>
                                {
                                    order.expire_timestamp && order.active &&
                                    <p>
                                        <small>
                                            <b>Next Payment:</b>&nbsp;{formatFullDate(order.expire_timestamp)}
                                        </small>
                                    </p>
                                }
                                <div className={cardStyles.card + ' ' + layoutStyles.mT1}>
                                    <div className={cardStyles.cardHeader}>
                                        <h4>Order Summary</h4>
                                    </div>
                                    <div className={cardStyles.cardBody}>
                                        <ul className={layoutStyles.mN} style={{paddingLeft: "calc(1rem + 10px)"}}>
                                            <li>{order.product.title} - {price(order.product.price)} {order.product.currency}</li>
                                            {order.attributes.map(attribute => (
                                                <li key={attribute.id}>
                                                    {attribute.attribute.title} - {price(attribute.attribute.price)} {order.currency} x {attribute.quantity}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className={cardStyles.cardFooter}>
                                        <p><b>Total:</b>&nbsp;{price(order.price)}&nbsp;{order.currency}</p>
                                    </div>
                                </div>
                                <div className={layoutStyles.mT1}>
                                    <div className={layoutStyles.flex}>
                                        <h4>Invoices</h4>
                                        {
                                            isCrypto &&
                                            <div className={layoutStyles.mL}>
                                                {
                                                    !hasActive &&
                                                    <button
                                                    disabled={manager.generatingInvoice}
                                                    className={
                                                        formStyles.button + ' ' + formStyles.buttonSmall + ' ' +
                                                        formStyles.buttonIcon
                                                    }
                                                    onClick={handleGenerateInvoice}>
                                                        {
                                                            !manager.generatingInvoice && "Generate Invoice"
                                                        }
                                                        {
                                                            manager.generatingInvoice &&
                                                            <CircleLoading width={21} />
                                                        }
                                                    </button>
                                                }
                                                {
                                                    hasActive &&
                                                    <button
                                                    disabled={manager.refreshing}
                                                    className={
                                                        formStyles.button + ' ' + formStyles.buttonSmall + ' ' +
                                                        formStyles.buttonIcon + ' ' + layoutStyles.mL
                                                    }
                                                    onClick={handleRefresh}>
                                                        {
                                                            !manager.refreshing && "Refresh"
                                                        }
                                                        {
                                                            manager.refreshing &&
                                                            <CircleLoading width={21} />
                                                        }
                                                    </button>
                                                }
                                            </div>
                                        }
                                    </div>
                                    {
                                        order.invoices.length === 0 &&
                                        <div className={formStyles.alert + ' ' + layoutStyles.mT1}>
                                            There are no invoices.
                                        </div>
                                    }
                                    {
                                        order.invoices.slice(0, (manager.showAllInvoices ? order.invoices.length : 3)).map(invoice => (
                                            <InvoiceOld key={invoice.id} invoice={invoice} />
                                        ))
                                    }
                                    {
                                        !manager.showAllInvoices && order.invoices.length > 3 &&
                                        <div className={layoutStyles.mT1}>
                                            <button className={formStyles.button + ' ' + formStyles.buttonSmall} onClick={handleShowAllInvoices}>
                                                Show All
                                            </button>
                                        </div>
                                    }
                                </div>
                                <div className={layoutStyles.mT1}>
                                    <h4>Payment Method</h4>
                                    {
                                        order.invoices.slice(0, (manager.showAllInvoices ? order.invoices.length : (isCrypto ? 1 : order.invoices.length))).map(invoice => {
                                            if(invoice.payment_method){
                                                if(paymentMethods.includes(invoice.payment_method.id)){
                                                    return null;
                                                }

                                                paymentMethods.push(invoice.payment_method.id);
                                            }

                                            return (
                                                <div className={formStyles.alert + ' ' + layoutStyles.mT1}  key={"payment-method-" + invoice.payment_method.id}>
                                                    {
                                                        invoice.payment_method.type === PAYMENT_METHOD_PAYPAL &&
                                                        <div className={layoutStyles.flex + ' ' + layoutStyles.flexColumn + ' ' + layoutStyles.flexGrow}>
                                                            <div className={layoutStyles.flex}>
                                                                <div>
                                                                    PayPal
                                                                </div>
                                                                {
                                                                    invoice.payment_method.recurring &&
                                                                    <div className={layoutStyles.mL}>
                                                                        <div className={formStyles.badge}>
                                                                            {invoice.payment_method.cancelled ? "Cancelled" : "Active"}
                                                                        </div>
                                                                    </div>
                                                                }
                                                            </div>
                                                            {
                                                                invoice.payment_method.recurring && !invoice.payment_method.cancelled &&
                                                                <div>
                                                                    <hr />
                                                                    <a href={PAYPAL_CANCEL_URL}
                                                                       target="_blank"
                                                                       className={formStyles.button + ' ' + formStyles.buttonSmall}>
                                                                        Cancel
                                                                    </a>
                                                                </div>
                                                            }
                                                        </div>
                                                    }
                                                    {
                                                        invoice.payment_method.type === PAYMENT_METHOD_CREDIT_CARD_STRIPE &&
                                                        <div className={layoutStyles.flex + ' ' + layoutStyles.flexColumn + ' ' + layoutStyles.flexGrow}>
                                                            <div className={layoutStyles.flex}>
                                                                <div>
                                                                    Card
                                                                </div>
                                                                {
                                                                    invoice.payment_method.recurring &&
                                                                    <div className={layoutStyles.mL}>
                                                                        <div className={formStyles.badge}>
                                                                            {invoice.payment_method.cancelled ? "Cancelled" : "Active"}
                                                                        </div>
                                                                    </div>
                                                                }
                                                            </div>
                                                            {
                                                                invoice.payment_method.recurring && !invoice.payment_method.cancelled &&
                                                                <div>
                                                                    <hr />
                                                                    <button onClick={handleCancel}
                                                                            className={formStyles.button + ' ' + formStyles.buttonSmall + ' ' + formStyles.buttonIcon + ' ' + layoutStyles.wF}>
                                                                        {
                                                                            manager.sending &&
                                                                            <CircleLoading width={16} />
                                                                        }
                                                                        {
                                                                            !manager.sending && "Cancel"
                                                                        }
                                                                    </button>
                                                                </div>
                                                            }
                                                        </div>
                                                    }
                                                    {
                                                        PAYMENT_METHOD_CRYPTO_LIST.includes(invoice.payment_method.type) &&
                                                        <div className={layoutStyles.flex + ' ' + layoutStyles.flexColumn + ' ' + layoutStyles.flexGrow}>
                                                            <div className={layoutStyles.flex}>
                                                                <div>
                                                                    Cryptocurrency
                                                                </div>
                                                                {
                                                                    (order.recurring && order.active) &&
                                                                    <div className={layoutStyles.mL}>
                                                                        <div className={formStyles.badge}>
                                                                            {invoice.payment_method.cancelled ? "Cancelled" : "Active"}
                                                                        </div>
                                                                    </div>
                                                                }
                                                            </div>
                                                            {
                                                                (order.recurring && order.active) &&
                                                                <div>
                                                                    <hr />
                                                                    <button onClick={handleCancel}
                                                                            className={formStyles.button + ' ' + formStyles.buttonSmall + ' ' + formStyles.buttonIcon + ' ' + layoutStyles.wF}>
                                                                        {
                                                                            manager.sending &&
                                                                            <CircleLoading width={16} />
                                                                        }
                                                                        {
                                                                            !manager.sending && "Cancel"
                                                                        }
                                                                    </button>
                                                                </div>
                                                            }
                                                        </div>
                                                    }
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            <div className={modalStyles.footer}>
                                <button className={formStyles.button} onClick={props.close}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

OrderModal.propTypes = {
    close: PropTypes.func.isRequired,
    cancelOrder: PropTypes.func.isRequired,
    updateOrder: PropTypes.func.isRequired,
    order: PropTypes.object.isRequired,
};

export default OrderModal;

