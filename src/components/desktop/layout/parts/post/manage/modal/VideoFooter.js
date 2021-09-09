// @flow

import React from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";

import formStyles from "../../../../../../../css/form.css";
import layoutStyles from "../../../../../../../css/layout.css";
import postModalStyles from "../../../../../../../css/layout/social/post-modal.css";

import CircleLoading from "../../../../../../../assets/loading/circle-loading.svg";

const Footer = (props) => {
    return (
        <div className={postModalStyles.footer}>
            {
                (props.part === 1) &&
                <button className={formStyles.button} disabled={props.isSubmitting} onClick={props.callbackClose}>Close</button>
            }
            {
                (props.part === 2 && !props.showCaptcha) &&
                <button className={formStyles.button} disabled={props.isSubmitting} onClick={() => {props.handlePart(1)}}>Back</button>
            }
            {
                (props.showCaptcha) &&
                <button className={formStyles.button} disabled={props.isSubmitting} onClick={() => {props.handleCaptchaBack()}}>Back</button>
            }
            {
                (((props.auth.user !== null && props.auth.user.boosted) || (props.showCaptcha)) && props.part === 2) &&
                <button
                    disabled={
                        props.postButtonDisabled()
                        ||
                        (props.auth.user !== null && !props.auth.user.boosted && props.securityCodeLength === 0)
                    }
                    className={formStyles.button + ' ' + formStyles.buttonPrimary + ' ' + formStyles.buttonIcon + ' ' + postModalStyles.submitButton + ' ' + layoutStyles.mL}
                    onClick={props.handleSubmit}>
                    {
                        !props.isSubmitting && "Post"
                    }
                    {
                        props.isSubmitting && <CircleLoading width={16} />
                    }
                </button>
            }
            {
                (props.auth.user !== null && !props.auth.user.boosted && !props.showCaptcha && props.part === 2) &&
                <button
                    className={formStyles.button + ' ' + formStyles.buttonPrimary + ' ' + layoutStyles.mL}
                    disabled={props.postButtonDisabled()}
                    onClick={props.handleCaptchaNext}>
                    Next
                </button>
            }
            {
                (!props.showCaptcha && props.part === 1) &&
                <button
                    className={formStyles.button + ' ' + formStyles.buttonPrimary + ' ' + layoutStyles.mL}
                    disabled={props.nextButtonDisabled()}
                    onClick={() => {props.handlePart(2)}}>
                    Next
                </button>
            }
        </div>
    );
};

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth };
};

Footer.propTypes = {
    postButtonDisabled: PropTypes.func,
    handleSubmit: PropTypes.func,
    callbackClose: PropTypes.func,
    handleCaptchaNext: PropTypes.func,
    showCaptcha: PropTypes.bool,
    securityCodeLength: PropTypes.number,
    isSubmitting: PropTypes.bool,
}

export default connect(mapStateToProps)(Footer);
