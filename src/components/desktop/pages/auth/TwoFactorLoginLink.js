import React, {useEffect, useState} from "react";
import { connect } from "react-redux";
import {Link} from "react-router-dom";

import formStyles from "../../../../css/form.css";
import layoutStyles, { mB2 } from "../../../../css/layout.css";

import LoadingCircle from "../../../../assets/loading/circle.svg";
import TimesIcon from "../../../../assets/svg/icons/times.svg";

import Container from "../../layout/parts/auth/Container";

import {CONTAINER, REVERT, useLayerDispatch} from "../../layout/layer/context";
import {loginLink} from "../../../../reducers/auth/actions";
import store from "../../../../store";
import history from "../../../../util/history";

function TwoFactorLoginLink(props) {
  let dispatch = useLayerDispatch();

  const [manager, setManager] = useState({
    loading: true,
  });

  useEffect(() => {
    if(props.auth.isAuthenticated){
      setTimeout(() => {
        history.push("/social/feed");
        dispatch({ type: CONTAINER, payload: REVERT });
      }, 2400);
    }
  }, [props.auth.isAuthenticated])

  useEffect(() => {
    if(!props.auth.isAuthenticated){
      store.dispatch(loginLink({ code: props.match.params.code }));
    }
  }, [props.match.params.code])

  useEffect(() => {
    switch(props.auth.error) {
      case "TWO_FACTOR_EMAIL_ERROR":
        setManager({
          ...manager,
          loading: false,
        })
        break;
      case "WRONG_CREDENTIALS":
        setManager({
          ...manager,
          loading: false,
        })
        break;
      case "UNKNOWN_ERROR":
        setManager({
          ...manager,
          loading: false,
        })
        break;
    }
  }, [props.auth.error]);

  return (
      <Container>
        <div className={formStyles.formGroup}>
          <p>Welcome back! Please login to your account.</p>
        </div>
        {
          props.auth.error === "TWO_FACTOR_EMAIL_ERROR" &&
              <div>
                <div className={formStyles.alert + ' ' + layoutStyles.mB1}>
                  <TimesIcon height={16} />
                  <p>
                    This is an invalid login link.
                  </p>
                </div>
                <hr className={layoutStyles.mB1} />
                <p className={layoutStyles.mB1}>It may have expired, you can get have another one sent, click below.</p>
                <hr className={layoutStyles.mB1}/>
                <Link className={formStyles.button + ' ' + formStyles.buttonPrimary} to={`/login`}>
                  Login
                </Link>
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
          (props.auth.isLoading || props.auth.isAuthenticated || manager.loading) && <LoadingCircle className={mB2} width="60%" style={{marginLeft: "20%"}} />
        }
      </Container>
  );
}

const mapStateToProps = state => {
  const { auth } = state;
  return { auth: auth };
};

export default connect(mapStateToProps)(TwoFactorLoginLink);
