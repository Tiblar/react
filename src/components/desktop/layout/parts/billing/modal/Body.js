// @flow

import React, {useState} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";

import formStyles from "../../../../../../css/form.css";
import modalStyles from "../../../../../../css/components/modal.css";

import Summary from "./Summary";

function Body(props) {

    return (
        <div className={modalStyles.modal}>
            <div className={modalStyles.top}>
                <div className={modalStyles.header}>
                    <h4>{props.product.title}</h4>
                </div>
            </div>
            <Summary attributes={props.attributes} product={props.product} />
            <div className={modalStyles.footer}>
                <button className={formStyles.button} onClick={props.close}>Close</button>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    const { auth } = state;
    return { auth: auth };
};

Body.propTypes = {
    close: PropTypes.func,
    product: PropTypes.object,
    attributes: PropTypes.object,
}

export default connect(mapStateToProps)(Body);
