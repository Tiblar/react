import React, {useEffect, useRef, useState} from "react";
import { connect } from "react-redux";
import axios from "axios";

import formStyles from "../../../../css/form.css";
import layoutStyles from "../../../../css/layout.css";
import authStyles from "../../../../css/layout/auth.css";

import ConfirmIcon from "../../../../assets/svg/icons/check.svg"
import TimesIcon from "../../../../assets/svg/icons/times.svg"

import Container from "../../layout/parts/auth/NoRedirectContainer";

import fetchCaptcha from "../../../../util/captcha";
import {API_URL} from "../../../../util/constants";
import ContentLoader from "../../../../util/components/ContentLoader";

function ConfirmEmail(props) {
    const securityCodeRef = useRef();

    const [manager, setManager] = useState({
        securityCode: {
            value: "",
            error: null,
        },
        confirmed: false,
        saving: false,
        captchaURL: null,
        captchaId: null,
        captchaLoading: true,
        notFound: false,
    });

    useEffect(() => {
        loadCaptcha();
    }, [])

    function handleSecurityCode(e) {
        setManager({
            ...manager,
            securityCode: {
                ...manager.securityCode,
                value: e.target.value
            }
        })
    }

    function handleEnterKeyLast(e) {
        if (e.key !== "Enter") return;

        e.preventDefault();

        handleSubmit();
    }

    function handleSubmit() {
        const config = {
            headers: {
                "Content-Type": "application/json"
            },
            params: {
                security_id: manager.captchaId,
                security_code: manager.securityCode.value,
            }
        };

        axios.get(API_URL + '/auth/confirm-email/' + props.match.params.code, config)
            .then(function (res) {
                setManager({ ...manager, confirmed: true });
            })
            .catch(function (err) {
                if(err.response && err.response.data.errors.captcha){
                    setManager({
                        ...manager,
                        confirmed: false,
                        securityCode: {
                            ...manager.securityCode,
                            error: true,
                            value: ""
                        },
                        captchaURL: null,
                        captchaId: null,
                        captchaLoading: true,
                        saving: false,
                    });

                    securityCodeRef.current.focus();
                    loadCaptcha();
                }

                if(err.response && err.response.status === 404){
                    setManager({
                        ...manager,
                        saving: false,
                        notFound: true,
                    })
                }
            });
    }

    function loadCaptcha() {
        fetchCaptcha().then(data => {
            setManager(manager => ({
                ...manager,
                captchaURL: data.captcha,
                captchaId: data.id,
            }))
        });
    }

    const Placeholder = () => (
        <ContentLoader
            width="100%"
            height="135"
            viewBox="0 0 100 135"
            preserveAspectRatio="none"
        >
            <rect x="0" y="0" width="100%" height="135" />
        </ContentLoader>
    );

    return (
        <Container>
            {
                !manager.notFound &&
                <div className={formStyles.formGroup}>
                    <p>Please confirm email.</p>
                </div>
            }
            <div style={{display: !manager.confirmed && !manager.notFound ? "block" : "none"}}>
                <div className={formStyles.formGroup}>
                    {
                        manager.captchaURL &&
                        <img
                            alt="captcha"
                            className={layoutStyles.wF + ' ' + (manager.captchaLoading ? layoutStyles.hide : '')}
                            onLoad={() => { setManager({ ...manager, captchaLoading: false }) }}
                            src={manager.captchaURL}
                        />
                    }
                    {
                        (!manager.captchaURL || manager.captchaLoading) && <Placeholder />
                    }
                </div>
                <div className={formStyles.formGroup}>
                    {
                        manager.securityCode.error && <label className={formStyles.invalidLabel}>Incorrect security code.</label>
                    }
                    <input
                        type="text"
                        ref={securityCodeRef}
                        onChange={handleSecurityCode}
                        onKeyPress={handleEnterKeyLast}
                        value={manager.securityCode.value}
                        maxLength={4}
                        className={
                            formStyles.input + ' ' +
                            (manager.securityCode.error ? formStyles.invalidInput : '')
                        }
                        placeholder="Security code"
                    />
                </div>
                <div className={formStyles.formGroup}>
                    <button
                        disabled={(manager.securityCode.value === "")}
                        onClick={handleSubmit}
                        className={formStyles.button + " " + authStyles.authButton + " " + layoutStyles.flexGrow}>
                        Confirm
                    </button>
                </div>
            </div>
            <div style={{display: manager.confirmed && !manager.notFound ? "block" : "none"}}>
                <div className={formStyles.alert + ' ' + layoutStyles.mB1}>
                    <ConfirmIcon height={16} /> Confirmed Email
                </div>
                <hr />
                <p className={layoutStyles.mT1}>
                    You can now enable two factor authentication in your settings and if you lose your password you can reset it through your email.
                </p>
            </div>
            <div style={{display: manager.notFound ? "block" : "none"}}>
                <div className={formStyles.alert + ' ' + layoutStyles.mB1}>
                    <TimesIcon height={16} /> Confirmation not found
                </div>
                <hr />
                <p className={layoutStyles.mT1}>
                    The code may be expired or you may have already confirmed this email, you can request a new code in your settings.
                </p>
            </div>
        </Container>
    );
}

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth };
};

export default connect(mapStateToProps)(ConfirmEmail);
