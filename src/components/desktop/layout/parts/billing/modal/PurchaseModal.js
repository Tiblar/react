// @flow

import React, {useState, useEffect} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import axios from "axios";
import {isMobile} from "is-mobile";

import layoutStyles from "../../../../../../css/layout.css";
import modalStyles from "../../../../../../css/components/modal.css";

import LoadingGraphic from "../../../../../../assets/loading/dots.svg";

import Body from "./Body";

import {API_URL} from "../../../../../../util/constants";
import useScript from "../../../../../../util/hooks/useScript";

function PurchaseModal(props) {

    const [manager, setManager] = useState({
        product: null,
        loading: true,
    });

    useEffect(() => {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        axios.get(API_URL + `/market/product/${props.product_id}`, config)
            .then(function (res) {
                if(res.data && res.data.data.product){
                    setManager((manager) => ({
                        ...manager,
                        loading: false,
                        product: res.data.data.product
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
    }, []);

    //useScript("https://js.stripe.com/v3/");

    return (
        <div className={modalStyles.containerOuter + (isMobile() ? (" " + modalStyles.mobile) : "")}>
            <div className={modalStyles.wrapper}>
                <div className={modalStyles.containerInner}>
                    <div className={modalStyles.modalContainer}>
                        {
                            !manager.loading && <Body close={props.close} product={manager.product} attributes={props.attributes} />
                        }
                        {
                            manager.loading &&
                            <div className={modalStyles.modal}>
                                <div className={modalStyles.body + ' ' + layoutStyles.flex + ' ' +
                                layoutStyles.alignItemsCenter + ' ' + layoutStyles.justifyContentCenter}>
                                    <LoadingGraphic width="15%" />
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    const { auth } = state;
    return { auth: auth };
};

PurchaseModal.propTypes = {
    close: PropTypes.func,
    product_id: PropTypes.string,
    attributes: PropTypes.object
}

export default connect(mapStateToProps)(PurchaseModal);
