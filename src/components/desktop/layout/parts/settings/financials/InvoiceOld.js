import React from "react";
import PropTypes from "prop-types";

import formStyles from "../../../../../../css/form.css";
import layoutStyles from "../../../../../../css/layout.css";

import CopyIcon from "../../../../../../assets/svg/icons/copy.svg";

import {formatFullDate} from "../../../../../../util/date";
import {
    API_URL,
    INVOICE_EVENT_ONCE,
    INVOICE_EVENT_RECURRING,
    INVOICE_EVENT_RECURRING_DOWNGRADE,
    INVOICE_EVENT_RECURRING_START,
    INVOICE_EVENT_RECURRING_UPGRADE,
    INVOICE_STATUS_DECLINED,
    INVOICE_STATUS_DELETED,
    INVOICE_STATUS_FRAUD,
    INVOICE_STATUS_OTHER,
    INVOICE_STATUS_PAID,
    INVOICE_STATUS_PENDING,
    INVOICE_STATUS_REFUNDED,
    PAYMENT_METHOD_CREDIT_CARD_STRIPE,
    PAYMENT_METHOD_CRYPTOCURRENCY,
    PAYMENT_METHOD_MONERO,
    PAYMENT_METHOD_BITCOIN,
    PAYMENT_METHOD_LITECOIN,
    PAYMENT_METHOD_BITCOIN_CASH,
    PAYMENT_METHOD_TETHER,
    PAYMENT_METHOD_USD_COIN,
    PAYMENT_METHOD_DOGE,
    PAYMENT_METHOD_PAYPAL
} from "../../../../../../util/constants";
import {INVOICE_STATUS_EXPIRED} from "../../../../../../util/constants_template";
import CopyButton from "../../../../../../util/components/CopyButton";

function InvoiceOld(props) {

    function parsePaymentMethod(value) {
        switch(value) {
            case PAYMENT_METHOD_PAYPAL:
                return "PayPal";
            case PAYMENT_METHOD_CREDIT_CARD_STRIPE:
                return "Credit Card";
            case PAYMENT_METHOD_CRYPTOCURRENCY:
                return "Cryptocurrency";
            case PAYMENT_METHOD_BITCOIN:
                return "Bitcoin";
            case PAYMENT_METHOD_MONERO:
                return "Monero";
            case PAYMENT_METHOD_LITECOIN:
                return "Litecoin";
            case PAYMENT_METHOD_BITCOIN_CASH:
                return "Bitcoin Cash";
            case PAYMENT_METHOD_TETHER:
                return "Tether";
            case PAYMENT_METHOD_USD_COIN:
                return "USD Coin";
            case PAYMENT_METHOD_DOGE:
                return "Dogecoin";
            default:
                return "Unknown";
        }
    }

    function parsePaymentStatus(value) {
        switch(value) {
            case INVOICE_STATUS_DECLINED:
                return "Declined";
            case INVOICE_STATUS_DELETED:
                return "Deleted";
            case INVOICE_STATUS_FRAUD:
                return "Declined (Fraud)";
            case INVOICE_STATUS_OTHER:
                return "Other";
            case INVOICE_STATUS_PENDING:
                return "Pending";
            case INVOICE_STATUS_PAID:
                return "Paid";
            case INVOICE_STATUS_REFUNDED:
                return "Refunded";
            case INVOICE_STATUS_EXPIRED:
                return "Expired";
            default:
                return "Unknown";
        }
    }

    function parsePaymentStatusCrypto(value) {
        switch(value) {
            case INVOICE_STATUS_DECLINED:
                return "Declined";
            case INVOICE_STATUS_DELETED:
                return "Deleted";
            case INVOICE_STATUS_FRAUD:
                return "Declined (Fraud)";
            case INVOICE_STATUS_OTHER:
                return "Other";
            case INVOICE_STATUS_PENDING:
                return "Awaiting";
            case INVOICE_STATUS_PAID:
                return "Confirmed";
            case INVOICE_STATUS_REFUNDED:
                return "Refunded";
            case INVOICE_STATUS_EXPIRED:
                return "Timed Out";
            default:
                return "Unknown";
        }
    }

    function parseEvent(value) {
        switch(value) {
            case INVOICE_EVENT_ONCE:
                return "One time payment";
            case INVOICE_EVENT_RECURRING:
                return "Subscription payment";
            case INVOICE_EVENT_RECURRING_START:
                return "Subscription start";
            case INVOICE_EVENT_RECURRING_DOWNGRADE:
                return "Subscription downgrade";
            case INVOICE_EVENT_RECURRING_UPGRADE:
                return "Subscription upgrade";
            default:
                return "Unknown";
        }
    }

    let invoice = props.invoice;

    return (
        <div className={formStyles.alert + ' ' + layoutStyles.mT1} key={invoice.id}>
            <div className={layoutStyles.flexGrow}>
                <div className={layoutStyles.flex}>
                    <div className={layoutStyles.flex + ' ' + layoutStyles.flexColumn}>
                        <small><b>Event:</b>&nbsp;{parseEvent(invoice.event)}</small>
                    </div>
                    <div className={layoutStyles.mL}>
                        <small>{invoice.price}&nbsp;{invoice.currency}</small>
                    </div>
                </div>
                <hr />
                <div className={layoutStyles.flex}>
                    <small><b>Method:</b>&nbsp;{parsePaymentMethod(invoice.payment_method.type)}</small>
                </div>
                <hr />
                <div className={layoutStyles.flex}>
                    <div>
                        {
                            invoice.tx_id &&
                            <small><b>Tx ID:</b>&nbsp;{invoice.tx_id}</small>
                        }
                        {
                            !invoice.tx_id &&
                            <small>-</small>
                        }
                    </div>
                    <div className={layoutStyles.mL}>
                        <div className={formStyles.badge}>
                            {parsePaymentStatus(invoice.payment_status)}
                        </div>
                    </div>
                </div>
                <hr />
                <div className={layoutStyles.flex}>
                    <div className={layoutStyles.flex + ' ' + layoutStyles.flexColumn}>
                        {
                            <small><b>Timestamp:</b>&nbsp;{formatFullDate(invoice.timestamp)}</small>
                        }
                        {
                            invoice.expire_timestamp &&
                            <small><b>Expire Timestamp:</b>&nbsp;{formatFullDate(invoice.expire_timestamp)}</small>
                        }
                    </div>
                </div>
                {
                    (invoice.payment_method && invoice.payment_method.crypto) &&
                    <div>
                        <hr />
                        <div className={layoutStyles.flex}>
                            <small><b>{parsePaymentMethod(invoice.payment_method.type)} Transaction</b></small>
                            <div className={layoutStyles.mL}>
                                {
                                    Date.parse(invoice.expire_timestamp) > (new Date()) &&
                                    <div className={formStyles.badge}>
                                        {
                                            parsePaymentStatusCrypto(invoice.payment_status)
                                        }
                                    </div>
                                }
                                {
                                    Date.parse(invoice.expire_timestamp) < (new Date()) &&
                                    <div className={formStyles.badge + ' ' + formStyles.danger}>
                                        Timed out
                                    </div>
                                }
                            </div>
                        </div>
                        {
                            Date.parse(invoice.expire_timestamp) < (new Date()) &&
                            <div className={formStyles.alert + ' ' + layoutStyles.mT1}>
                                Do not send any crypto. This invoice is expired.
                            </div>
                        }
                        <div className={layoutStyles.flex + ' ' + layoutStyles.mT1}>
                            <small><b>Purchase Crypto:</b></small>
                        </div>
                        <a href="https://changenow.io?link_id=28a36f57fa8060">Buy crypto through ChangeNow</a>
                        <div className={layoutStyles.flex + ' ' + layoutStyles.mT1}>
                            <small><b>Deposit Address:</b></small>
                        </div>
                        <div className={layoutStyles.flex}>
                            <input className={formStyles.input} value={invoice.payment_method.crypto.address} readOnly={true} />
                            <div className={layoutStyles.flex + ' ' + layoutStyles.mL1}>
                                <CopyButton
                                    copyText={invoice.payment_method.crypto.address.toString()}
                                    toast={false}
                                    className={formStyles.button + ' ' + formStyles.buttonIcon}>
                                    <CopyIcon width={16} height={16} />
                                </CopyButton>
                            </div>
                        </div>
                        <div className={layoutStyles.flex + ' ' + layoutStyles.mT1}>
                            <small><b>Deposit Amount:</b></small>
                        </div>
                        <div className={layoutStyles.flex}>
                            <input className={formStyles.input} value={invoice.payment_method.crypto.amount} readOnly={true} />
                            <div className={layoutStyles.flex + ' ' + layoutStyles.mL1}>
                                <CopyButton
                                    copyText={invoice.payment_method.crypto.amount.toString()}
                                    toast={false}
                                    className={formStyles.button + ' ' + formStyles.buttonIcon}>
                                    <CopyIcon width={16} height={16} />
                                </CopyButton>
                            </div>
                        </div>
                        <div className={layoutStyles.flex + ' ' + layoutStyles.mT1}>
                            <small><b>QR Code:</b></small>
                        </div>
                        <div className={layoutStyles.flex}>
                            <img src={API_URL + "/market/purchase/qr/" + invoice.id} alt="Cryto QR Code" />
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}

InvoiceOld.propTypes = {
    invoice: PropTypes.object,
}

export default InvoiceOld;

