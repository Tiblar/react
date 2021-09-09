import React, {useEffect, useRef, useState} from "react";
import { connect } from "react-redux";
import {Link} from "react-router-dom";
import axios from "axios";

import formStyles from "../../../../css/form.css";
import layoutStyles from "../../../../css/layout.css";
import authStyles from "../../../../css/layout/auth.css";

import ConfirmIcon from "../../../../assets/svg/icons/check.svg";

import Container from "../../layout/parts/auth/NoRedirectContainer";

import fetchCaptcha from "../../../../util/captcha";
import {API_URL, ERROR_RATE_LIMIT} from "../../../../util/constants";
import ContentLoader from "../../../../util/components/ContentLoader";

function Forgot() {
  const securityCodeRef = useRef();
  const _isMounted = useRef(true);

  const [manager, setManager] = useState({
    requested: false,
    email: "",
    securityCode: "",
    captchaURL: null,
    captchaId: null,
    captchaLoading: true,
    error: null,
  });

  useEffect(() => {
    return () => {
      _isMounted.current = false
    }
  }, []);

  useEffect(() => {
    loadCaptcha();
  }, [])

  function handleEnterKeyLast(e) {
    if (e.key !== "Enter") return;

    e.preventDefault();

    handleSubmit();
  }

  function handleSubmit() {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    let body = {
      email: manager.email,
      security_id: manager.captchaId,
      security_code: manager.securityCode,
    }

    axios.post(API_URL + "/auth/forgot", body, config).then(res => {
      setManager((manager) => ({
        ...manager,
        requested: true,
        error: null,
      }));
    }).catch(err => {
     if(err.response && err.response.data.errors.captcha){
       setManager((manager) => ({
         ...manager,
         securityCode: "",
         error: "WRONG_SECURITY_CODE",
       }));
       loadCaptcha();
       securityCodeRef.current.focus();
     }else if(err.response && err.response.status === 429){
       setManager((manager) => ({
         ...manager,
         error: ERROR_RATE_LIMIT,
       }));
      }else{
       setManager((manager) => ({
         ...manager,
         error: "UNKNOWN_ERROR",
       }));
     }
    });
  }

  function handleEmail(e) {
    setManager({
      ...manager,
      email: e.target.value
    })
  }

  function handleSecurityCode(e) {
    setManager({
      ...manager,
      securityCode: e.target.value.toLowerCase()
    })
  }

  function loadCaptcha() {
    fetchCaptcha().then(data => {
      if(_isMounted.current) {
        setManager(manager => ({
          ...manager,
          captchaURL: data.captcha,
          captchaId: data.id,
        }))
      }
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
        <div className={formStyles.formGroup}>
          <p>Please enter the information.</p>
        </div>
        <div style={{display: manager.error !== "UNKNOWN_ERROR" && !manager.requested ? "block" : "none"}}>
          <div className={formStyles.formGroup}>
            <input
                type="text"
                onChange={handleEmail}
                value={manager.email}
                className={
                  formStyles.input
                }
                placeholder="Confirmed email"
            />
          </div>
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
              manager.error === "WRONG_SECURITY_CODE" && <label className={formStyles.invalidLabel}>Incorrect security code.</label>
            }
            <input
                type="text"
                ref={securityCodeRef}
                onChange={handleSecurityCode}
                onKeyPress={handleEnterKeyLast}
                value={manager.securityCode}
                maxLength={4}
                className={
                  formStyles.input + ' ' +
                  (manager.error === "WRONG_SECURITY_CODE" ? formStyles.invalidInput : '')
                }
                placeholder="Security code"
            />
          </div>
          {
            manager.error === ERROR_RATE_LIMIT &&
            <div className={formStyles.formGroup}>
              <div className={formStyles.alert}>
                <p>
                  Please wait before trying again.
                </p>
              </div>
            </div>
          }
          <div className={formStyles.formGroup}>
            <div className={layoutStyles.tbRowM}>
              <div className={layoutStyles.tbCol6}>
                <Link to="/login"
                      className={formStyles.button + ' ' + authStyles.authButton + ' ' + layoutStyles.flexGrow}>
                  Back to Login
                </Link>
              </div>
              <div className={layoutStyles.tbCol6}>
                <button
                    disabled={manager.securityCode === "" || manager.email === ""}
                    onClick={handleSubmit}
                    className={formStyles.button + ' ' + authStyles.authButton + ' ' + layoutStyles.flexGrow + ' ' + layoutStyles.wF}>
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
        <div style={{display: manager.requested ? "block" : "none"}}>
          <div className={formStyles.alert + ' ' + layoutStyles.mB1}>
            <ConfirmIcon height={16} /> Request was made
          </div>
          <hr />
          <p className={layoutStyles.mT1}>
            If you have entered the correct confirmed email on your account, then an email has been sent to you.
          </p>
        </div>
        {
          manager.error === "UNKNOWN_ERROR" &&
          <div className={formStyles.formGroup}>
            <div className={formStyles.alert}>
              <p>
                There was an unknown error. Refresh and try again. <a href="/support">Contact support</a> if this issue persists.
              </p>
            </div>
          </div>
        }
      </Container>
  );
}

const mapStateToProps = state => {
  const { auth } = state;
  return { auth: auth };
};

export default connect(mapStateToProps)(Forgot);
