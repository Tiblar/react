import React, {useEffect, useRef, useState} from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import formStyles from "../../../../css/form.css";
import layoutStyles, { flexGrow, mL, wF, small, mB2 } from "../../../../css/layout.css";
import authStyles from "../../../../css/layout/auth.css";

import LoadingCircle from "../../../../assets/loading/circle.svg";
import CheckIcon from "../../../../assets/svg/icons/check.svg";

import Container from "../../layout/parts/auth/Container";

import {CONTAINER, REVERT, useLayerDispatch} from "../../layout/layer/context";
import fetchCaptcha from "../../../../util/captcha";
import {login} from "../../../../reducers/auth/actions";
import store from "../../../../store";
import history from "../../../../util/history";

function Login(props) {
  const securityCodeRef = useRef();
  const _isMounted = useRef(true);

  let dispatch = useLayerDispatch();

  const [manager, setManager] = useState({
    part: 0,
    twoFactorEmail: false,
    banned: false,
    form: {
      username: {
        value: "",
      },
      password: {
        value: "",
      },
      securityCode: {
        value: "",
        error: null,
      },
    },
    captchaURL: null,
    captchaId: null,
  });

  useEffect(() => {
    return () => {
      _isMounted.current = false
    }
  }, []);

  useEffect(() => {
    loadCaptcha();
  }, [])

  useEffect(() => {
    document.addEventListener('keypress', handleEnterKeyFirst)

    return () => {
      document.removeEventListener('keypress', handleEnterKeyFirst)
    }
  })

  useEffect(() => {
    if(props.auth.isAuthenticated){
      setTimeout(() => {
        let search = window.location.search;
        search = search.replace(/\+/g, '%2b');

        const urlParams = new URLSearchParams(search);
        let to = urlParams.get('to');

        if(!to || to.charAt(0) !== "/"){
          history.push("/social/feed");
        }else{
          window.location.replace(decodeURIComponent(to));
        }

        dispatch({ type: CONTAINER, payload: REVERT });
      }, 2400);
    }
  }, [props.auth.isAuthenticated, props.auth.token])

  useEffect(() => {
    switch(props.auth.error) {
      case "TWO_FACTOR_EMAIL":
        setManager(manager => ({
          ...manager,
          twoFactorEmail: true,
        }))
        break;
      case "BANNED":
        setManager(manager => ({
          ...manager,
          banned: true,
        }))
        break;
      case "WRONG_CREDENTIALS":
        setManager(manager => ({
          ...manager,
          form: {
            ...manager.form,
            securityCode: {
              ...manager.form.securityCode,
              value: ""
            }
          },
          part: 0
        }))
        loadCaptcha();
        break;
      case "WRONG_SECURITY_CODE":
        setManager(manager => ({
          ...manager,
          form: {
            ...manager.form,
            securityCode: {
              ...manager.form.securityCode,
              value: ""
            }
          }
        }))
        loadCaptcha();
        securityCodeRef.current.focus();
        break;
    }
  }, [props.auth.error]);

  function handleEnterKeyFirst(e) {
    if (e.key !== "Enter") return;

    e.preventDefault();

    handleNext();
  }

  function handleEnterKeyLast(e) {
    if (e.key !== "Enter") return;

    e.preventDefault();

    handleSubmit();
  }

  function handleSubmit() {
    store.dispatch(
        login({
          username: manager.form.username.value,
          password: manager.form.password.value,
          security_code: manager.form.securityCode.value,
          security_id: manager.captchaId,
        })
    );
  }

  function handleNext() {
    if(manager.form.username.value === "" || manager.form.password.value === "") return;

    setManager(manager => ({
      ...manager,
      part: 1,
    }))

    securityCodeRef.current.focus();
  }

  function handleUsername(e) {
    let value = e.target.value;

    setManager(manager => ({
      ...manager,
      form: {
        ...manager.form,
        username: {
          ...manager.form.username,
          value: value,
        }
      }
    }))
  }

  function handlePassword(e) {
    let value = e.target.value;

    setManager(manager => ({
      ...manager,
      form: {
        ...manager.form,
        password: {
          ...manager.form.password,
          value: value
        }
      }
    }))
  }

  function handleSecurityCode(e) {
    let value = e.target.value;

    setManager(manager => ({
      ...manager,
      form: {
        ...manager.form,
        securityCode: {
          ...manager.form.securityCode,
          value: value
        }
      }
    }))
  }

  function loadCaptcha() {
    fetchCaptcha().then(data => {
      if(_isMounted.current){
        setManager(manager => ({
          ...manager,
          captchaURL: data.captcha,
          captchaId: data.id,
        }))
      }
    });
  }

  return (
      <Container>
        <div className={formStyles.formGroup}>
          <p>Welcome back! Please login to your account.</p>
        </div>
        {
          !manager.twoFactorEmail &&
          <div style={{display: manager.part === 0 && !props.auth.isLoading && !props.auth.isAuthenticated ? "block" : "none"}}>
            <div className={formStyles.formGroup}>
              {
                props.auth.error === "WRONG_CREDENTIALS" && <label className={formStyles.invalidLabel}>Wrong username or password.</label>
              }
              <input
                  type="text"
                  onChange={handleUsername}
                  autoFocus={true}
                  value={manager.form.username.value}
                  className={
                    formStyles.input + ' ' +
                    (props.auth.error === "WRONG_CREDENTIALS" ? formStyles.invalidInput : '')
                  }
                  autoComplete="off"
                  placeholder="Username"
              />
            </div>
            <div className={formStyles.formGroup}>
              <input
                  type="password"
                  onChange={handlePassword}
                  value={manager.form.password.value}
                  className={
                    formStyles.input + ' ' +
                    (props.auth.error === "WRONG_CREDENTIALS" ? formStyles.invalidInput : '')
                  }
                  placeholder="Password"
              />
            </div>
            <div className={formStyles.formGroup}>
              <p className={formStyles.muted + ' ' + mL + ' ' + small}>
                <Link to="/forgot">Forgot password</Link>.
              </p>
            </div>
            <div className={formStyles.formGroup}>
              <button
                  disabled={
                    (manager.form.username.value === "") ||
                    (manager.form.password.value === "")
                  }
                  onClick={handleNext}
                  className={formStyles.button + " " + authStyles.authButton + " " + flexGrow}>
                Next
              </button>
            </div>
          </div>
        }
        {
          props.auth.error !== "UNKNOWN_ERROR" && props.auth.error !== "BANNED" && !manager.twoFactorEmail &&
          <div style={{display: manager.part === 1 && !props.auth.isLoading && !props.auth.isAuthenticated  ? "block" : "none"}}>
            <div className={formStyles.formGroup}>
              {
                manager.captchaURL &&
                <img
                    alt="captcha"
                    className={wF}
                    src={manager.captchaURL}
                />
              }
            </div>
            <div className={formStyles.formGroup}>
              {
                props.auth.error === "WRONG_SECURITY_CODE" && <label className={formStyles.invalidLabel}>Incorrect security code.</label>
              }
              <input
                  type="text"
                  ref={securityCodeRef}
                  onChange={handleSecurityCode}
                  onKeyPress={handleEnterKeyLast}
                  value={manager.form.securityCode.value}
                  maxLength={4}
                  className={
                    formStyles.input + ' ' +
                    (props.auth.error === "WRONG_SECURITY_CODE" ? formStyles.invalidInput : '')
                  }
                  placeholder="Security code"
              />
            </div>
            <div className={formStyles.formGroup}>
              <button
                  disabled={(manager.form.securityCode.value === "")}
                  onClick={handleSubmit}
                  className={formStyles.button + " " + authStyles.authButton + " " + flexGrow}>
                Sign In
              </button>
            </div>
          </div>
        }
        {
          props.auth.error === "UNKNOWN_ERROR" &&
          <div className={formStyles.formGroup}>
            <div className={formStyles.alert}>
              <p>
                There was an unknown error. Refresh and try again. <a href="/support">Contact support</a> if this issue persists.
              </p>
            </div>
          </div>
        }
        {
          props.auth.error === "BANNED" &&
          <div className={formStyles.formGroup}>
            <div className={formStyles.alert}>
              <p>
                You have been banned.
              </p>
            </div>
          </div>
        }
        {
          manager.twoFactorEmail &&
          <div className={formStyles.formGroup}>
            <div className={formStyles.alert + ' ' + layoutStyles.mB1}>
              <CheckIcon height={16} /> Login link sent.
            </div>
            <hr />
            <div className={formStyles.alert}>
              <p>
                An email containing a login link has been sent to you. You have 3 minutes to use it.
              </p>
            </div>
          </div>
        }
        {
          (props.auth.isLoading || props.auth.isAuthenticated) && <LoadingCircle className={mB2} width="60%" style={{marginLeft: "20%"}} />
        }
        <div>
          <Link className={small} to="/register">
            Create account
          </Link>
        </div>
      </Container>
  );
}

const mapStateToProps = state => {
  const { auth } = state;
  return { auth: auth };
};

export default connect(mapStateToProps)(Login);
