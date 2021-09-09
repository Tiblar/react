import React, {useEffect, useRef, useState} from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";

import formStyles from "../../../../css/form.css";
import { flexGrow, wF, small, mB2 } from "../../../../css/layout.css";
import authStyles from "../../../../css/layout/auth.css";

import LoadingCircle from "../../../../assets/loading/circle.svg";

import Container from "../../layout/parts/auth/Container";

import {API_URL, MAX_USERNAME_LENGTH, MIN_USERNAME_LENGTH} from "../../../../util/constants";
import history from "../../../../util/history";
import fetchCaptcha from "../../../../util/captcha";
import {register} from "../../../../reducers/auth/actions";
import {CONTAINER, REVERT, useLayerDispatch} from "../../layout/layer/context";
import store from "../../../../store";

function Register(props) {
  const securityCodeRef = useRef();
  const _isMounted = useRef(true);

  let dispatch = useLayerDispatch();

  const [manager, setManager] = useState({
    part: 0,
    form: {
      username: {
        value: "",
        error: null,
        validated: "",
        updated: new Date(),
      },
      email: {
        value: "",
        error: null,
      },
      password: {
        value: "",
        error: null,
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
  }, [props.auth.isAuthenticated])

  useEffect(() => {
    switch(props.auth.error) {
      case "USERNAME_LENGTH":
        setManager(manager => ({
          ...manager,
          form: {
            ...manager.form,
            username: {
              ...manager.form.username,
              error: "Username must be less than 16 characters.",
              validated: "",
              updated: new Date(),
            },
            securityCode: {
              ...manager.form.securityCode,
              value: ""
            }
          },
          part: 0
        }))
        loadCaptcha();
        break;
      case "EXISTING_USER":
        setManager(manager => ({
          ...manager,
          form: {
            ...manager.form,
            username: {
              ...manager.form.username,
              error: "This user already exists.",
              validated: "",
              updated: new Date(),
            },
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
    const urlParams = new URLSearchParams(window.location.search);
    const invite = urlParams.get('r');

    store.dispatch(
        register({
          username: manager.form.username.value,
          password: manager.form.password.value,
          email: manager.form.email.value,
          security_code: manager.form.securityCode.value,
          security_id: manager.captchaId,
          invite: invite,
        })
    );
  }

  function handleNext() {
    if((manager.form.username.error !== null || manager.form.username.validated === "") ||
        (manager.form.password.value === "")) return;

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
          value: value
        }
      }
    }))

    let username = e.target.value;

    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    axios
        .get(API_URL + "/auth/validate-username?username=" + username, config)
        .then(res => {
          let now = new Date();

          if(now.valueOf() < manager.form.username.updated.valueOf()){
            return;
          }

          setManager(manager => ({
            ...manager,
            form: {
              ...manager.form,
              username: {
                ...manager.form.username,
                error: null,
                validated: username,
                updated: now,
              }
            }
          }))
        })
        .catch(err => {
          let now = new Date();

          if(now.valueOf() < manager.form.username.updated.valueOf()){
            return;
          }

          setManager(manager => ({
            ...manager,
            form: {
              ...manager.form,
              username: {
                ...manager.form.username,
                error: err.response.data.errors.username,
                validated: username,
                updated: now,
              }
            }
          }))
        });
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
      if(_isMounted.current) {
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
          <p>Welcome newcomer! Create an account.</p>
        </div>
        <div style={{display: manager.part === 0 && !props.auth.isLoading && !props.auth.isAuthenticated ? "block" : "none"}}>
          <div className={formStyles.formGroup}>
            {
              manager.form.username.error !== null && <label className={formStyles.invalidLabel}>{manager.form.username.error}</label>
            }
            <input
                type="text"
                onChange={handleUsername}
                autoFocus={true}
                value={manager.form.username.value}
                className={
                  formStyles.input + ' ' +
                  (manager.form.username.error !== null ? formStyles.invalidInput : '')
                  + ' ' +
                  (manager.form.username.error === null && manager.form.username.validated !== "" ? formStyles.validInput : '')
                }
                autoComplete="off"
                maxLength={MAX_USERNAME_LENGTH}
                minLength={MIN_USERNAME_LENGTH}
                placeholder="Username"
            />
          </div>
          <div className={formStyles.formGroup}>
            <input
                type="text"
                className={formStyles.input}
                autoComplete="off"
                placeholder="Email (optional)"
            />
          </div>
          <div className={formStyles.formGroup}>
            <input
                type="password"
                onChange={handlePassword}
                value={manager.form.password.value}
                className={formStyles.input}
                placeholder="Password"
            />
          </div>
          <div className={formStyles.formGroup}>
            <button
                disabled={
                  (manager.form.username.error !== null || manager.form.username.validated === "") ||
                  (manager.form.password.value === "")
                }
                onClick={handleNext}
                className={formStyles.button + " " + authStyles.authButton + " " + flexGrow}>
              Next
            </button>
          </div>
        </div>
        {
          props.auth.error !== "UNKNOWN_ERROR" &&
          <div style={{display: manager.part === 1 && !props.auth.isLoading && !props.auth.isAuthenticated ? "block" : "none"}}>
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
              <small>By creating an account, you agree to the <a href="/support/pages/tos">ToS</a>. You must be over the age of 18 to use this website.</small>
            </div>
            <div className={formStyles.formGroup}>
              <button
                  disabled={(manager.form.securityCode.value === "")}
                  onClick={handleSubmit}
                  className={formStyles.button + " " + authStyles.authButton + " " + flexGrow}>
                Sign Up
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
          (props.auth.isLoading || props.auth.isAuthenticated) && <LoadingCircle className={mB2} width="60%" style={{marginLeft: "20%"}} />
        }
        <div>
          <Link className={small} to="/login">
            Already registered?
          </Link>
        </div>
      </Container>
  );
}

const mapStateToProps = state => {
  const { auth } = state;
  return { auth: auth };
};

export default connect(mapStateToProps)(Register);
