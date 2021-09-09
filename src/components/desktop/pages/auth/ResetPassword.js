import React, {useEffect, useRef, useState} from "react";
import { connect } from "react-redux";
import axios from "axios";
import {Link} from "react-router-dom";

import formStyles from "../../../../css/form.css";
import layoutStyles, { mB2 } from "../../../../css/layout.css";
import authStyles from "../../../../css/layout/auth.css";

import LoadingCircle from "../../../../assets/loading/circle.svg";
import ConfirmIcon from "../../../../assets/svg/icons/check.svg";
import TimesIcon from "../../../../assets/svg/icons/times.svg";


import Container from "../../layout/parts/auth/Container";

import history from "../../../../util/history";
import {CONTAINER, REVERT, useLayerDispatch} from "../../layout/layer/context";
import fetchCaptcha from "../../../../util/captcha";
import {API_URL} from "../../../../util/constants";
import ContentLoader from "../../../../util/components/ContentLoader";

function ResetPassword(props) {
  const securityCodeRef = useRef();

  let dispatch = useLayerDispatch();

  const [manager, setManager] = useState({
    reset: false,
    password: "",
    securityCode: "",
    captchaURL: null,
    captchaId: null,
    captchaLoading: true,
    error: null,
    notFound: false,
  });

  useEffect(() => {
    loadCaptcha();
  }, [])

  useEffect(() => {
    if(props.auth.isAuthenticated){
      setTimeout(() => {
        history.push("/social/feed");
        dispatch({ type: CONTAINER, payload: REVERT });
      }, 2400);
    }
  }, [props.auth.isAuthenticated])

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
      password: manager.password,
      security_id: manager.captchaId,
      security_code: manager.securityCode,
    }

    axios.post(API_URL + "/auth/reset/" + props.match.params.code, body, config).then(res => {
      setManager((manager) => ({
        ...manager,
        reset: true,
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
     }else if(err.response && err.response.status === 404){
       setManager((manager) => ({
         ...manager,
         notFound: true,
       }));
     }else{
       setManager((manager) => ({
         ...manager,
         error: "UNKNOWN_ERROR",
       }));
     }
    });
  }

  function handlePassword(e) {
    setManager({
      ...manager,
      password: e.target.value
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
        <div className={formStyles.formGroup}>
          <p>Enter new password.</p>
        </div>
        <div style={{
          display: manager.error !== "UNKNOWN_ERROR" && !manager.reset
                    && !manager.notFound && !props.auth.isLoading && !props.auth.isAuthenticated
                    ? "block" : "none"
        }}>
          <div className={formStyles.formGroup}>
            <input
                type="password"
                onChange={handlePassword}
                value={manager.password}
                className={
                  formStyles.input
                }
                placeholder="New password"
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
          <div className={formStyles.formGroup}>
            <button
                disabled={manager.securityCode === "" || manager.password === ""}
                onClick={handleSubmit}
                className={formStyles.button + ' ' + authStyles.authButton + ' ' + layoutStyles.flexGrow + ' ' + layoutStyles.wF}>
              Change Password
            </button>
          </div>
        </div>
        <div style={{display: manager.reset ? "block" : "none"}}>
          <div className={formStyles.alert + ' ' + layoutStyles.mB1}>
            <ConfirmIcon height={16} /> Password was changed.
          </div>
          <hr />
          <p className={layoutStyles.mT1}>
            You can now <Link to="/login">login</Link> with your new password.
          </p>
        </div>
        <div style={{display: manager.notFound ? "block" : "none"}}>
          <div className={formStyles.alert + ' ' + layoutStyles.mB1}>
            <TimesIcon height={16} /> Reset not found
          </div>
          <hr />
          <p className={layoutStyles.mT1}>
            The code may be expired or you may have already used this code, you can request a <Link to="/forgot">new code</Link>.
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
        {
          (props.auth.isLoading || props.auth.isAuthenticated) && <LoadingCircle className={mB2} width="60%" style={{marginLeft: "20%"}} />
        }
      </Container>
  );
}

const mapStateToProps = state => {
  const { auth } = state;
  return { auth: auth };
};

export default connect(mapStateToProps)(ResetPassword);
