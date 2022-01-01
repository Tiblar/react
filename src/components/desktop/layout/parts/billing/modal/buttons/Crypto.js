// @flow

import React, {useState, useEffect, useRef} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import axios from "axios";
import {toast} from "react-toastify";

import layoutStyles from "../../../../../../../css/layout.css";
import formStyles from "../../../../../../../css/form.css";

import LoadingGraphic from "../../../../../../../assets/loading/dots.svg";
import CircleLoading from "../../../../../../../assets/loading/circle-loading.svg";

import InvoiceOld from "../../../settings/financials/Invoice";

import {
    API_URL,
} from "../../../../../../../util/constants";

function Crypto(props) {
    const _isMounted = useRef(true);

    const [manager, setManager] = useState({
        order: null,
        refreshing: false,
    });

    useEffect(() => {
        return () => {
            _isMounted.current = false
        }
    }, []);

    useEffect(() => {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        const params = {
            payment_method: props.payment_method,
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

                props.setCrypto(null);
            });
    }, []);

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

        axios.get(API_URL + `/market/order/${manager.order.id}`, config)
            .then(function (res) {
                if(_isMounted.current && res.data && res.data.data.order){
                    setManager((manager) => ({
                        ...manager,
                        refreshing: false,
                        order: res.data.data.order,
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
    return (
        <div>
            {
                !manager.error && !manager.order &&
                <LoadingGraphic width={45} height={45} />
            }
            {
                manager.order &&
                <>
                    <div>
                        <button className={formStyles.button + ' ' + formStyles.buttonSmall + ' ' + formStyles.buttonIcon + ' ' + layoutStyles.mL} onClick={handleRefresh}>
                            {
                                !manager.refreshing && "Refresh"
                            }
                            {
                                manager.refreshing &&
                                <CircleLoading width={16} />
                            }
                        </button>
                    </div>
                    <div>
                        {manager.order.invoices.map(invoice => <InvoiceOld invoice={invoice} />)}
                    </div>
                </>
            }
        </div>
    );
};

const mapStateToProps = (state) => {
    const { auth } = state;
    return { auth: auth };
};

Crypto.propTypes = {
    setCrypto: PropTypes.func,
    payment_method: PropTypes.string,
    frequency: PropTypes.string,
    product: PropTypes.object,
    attributes: PropTypes.object,
}

export default connect(mapStateToProps)(Crypto);
