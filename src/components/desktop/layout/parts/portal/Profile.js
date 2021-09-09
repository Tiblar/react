// @flow

import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {toast} from "react-toastify";
import {isMobile} from "is-mobile";

import {
  active,
  bottom,
  icon,
  portal,
  profile,
  profilePopup,
  profilePopupButton,
  profilePopupChild,
  profilePopupShow
} from "../../../../../css/layout/portal.css";
import { flex, flexGrow, flexBasis0, justifyContentCenter, justifyContentSpaceAround, mL1, mR1, wF } from "../../../../../css/layout.css";
import {
  awayDot,
  disturbDot,
  offlineDot,
  onlineDot,
  positionAuto,
  statusDot
} from "../../../../../css/components/status-dots.css";
import {
  button,
  buttonSecondaryOutline,
  buttonSmall
} from "../../../../../css/form.css";

import LoginIcon from "../../../../../assets/svg/icons/login.svg";
import UserIcon from "../../../../../assets/svg/icons/user.svg";
import GearIcon from "../../../../../assets/svg/icons/gear.svg";

import store from "../../../../../store";

import {loadUser, logout} from "../../../../../reducers/auth/actions";
import {CONTAINER, LAYER, useLayerDispatch} from "../../layer/context";
import {API_URL, MAX_MOBILE_WIDTH} from "../../../../../util/constants";
import outsideClick from "../../../../../util/components/outsideClick";
import useWindowDimensions from "../../../../../util/hooks/useWindowDimensions";
import Appearance from "../../../pages/settings/Appearance";
import Container from "../settings/Container";

function Profile(props) {
  const dispatch = useLayerDispatch();
  const {width} = useWindowDimensions();

  let [manager, setManager] = useState({
    visible: false
  });

  const node = useRef();
  const ref = useRef();

  useEffect(() => {

    let matrixChat = document.getElementById("matrix-iframe");

    if(matrixChat && matrixChat.contentWindow){
      matrixChat.contentWindow.document.addEventListener("click", handleHide);
    }

    return () => {
      if(matrixChat && matrixChat.contentWindow){
        matrixChat.contentWindow.document.removeEventListener("click", handleHide);
      }
    };
  });

  const handleHide = () => {
    setManager({
      visible: false
    });
  };

  const handleClick = e => {
    if (node.current !== undefined && node.current.contains(e.target)) {
      setManager(manager => ({
        visible: !manager.visible
      }));

      return;
    }

    setManager({
      visible: false
    });
  };

  const handleChangeStatus = status => {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    let data = {
      status: status,
    };

    axios.patch(API_URL + `/users/@me/status`, data, config)
        .then(function (res) {
          store.dispatch(loadUser());
        })
        .catch(function (err) {
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
  };

  const handleLogout = e => {
    dispatch({ type: CONTAINER, payload: null });
    store.dispatch(logout());
  };

  useEffect(() => {
    document.addEventListener("mouseup", handleClick);

    return () => {
      document.removeEventListener("mouseup", handleClick);
    };
  }, []);

  let show = manager.visible ? profilePopupShow : "";

  function getStatusClass(status) {
    switch (status) {
      case "online":
        return onlineDot;
      case "dnd":
        return disturbDot;
      case "away":
        return awayDot;
      case "offline":
        return offlineDot;
      default:
        return offlineDot;
    }
  }

  const handleSettings = e => {
    dispatch({ type: LAYER, payload: <Appearance /> });
    dispatch({ type: CONTAINER, payload: <Container /> });
  };

  outsideClick(ref, () => {
    setManager({
      visible: false
    });
  });

  if (props.isAuthenticated) {
    let avatar = props.user !== null ? props.user.info.avatar : "";
    let status = props.user !== null ? props.user.info.status : "offline";

    return (
        <div ref={ref}>
          <div className={profilePopup + " " + show}>
            {
              isMobile() &&
              <div className={flex + ' ' + justifyContentSpaceAround}>
                <Link className={flexGrow + " " + flexBasis0 + " " + justifyContentCenter + " " + button + " " + mR1} to={'/' + props.user.info.username}>
                  <UserIcon height="13" className={icon} />
                  <p>Profile</p>
                </Link>
                <button className={flexGrow + " " + flexBasis0 + " " + justifyContentCenter + " " + button + " " + mL1} onClick={handleSettings}>
                  <GearIcon height="13" className={icon} />
                  <p>Settings</p>
                </button>
              </div>
            }
            {
              !isMobile() &&
              <Link className={profilePopupButton + " " + profilePopupChild} to={'/' + props.user.info.username}>
                <UserIcon width="13" className={icon} />
                <p className={mL1}>My Profile</p>
              </Link>
            }
            <hr />
            <div
                onClick={() => { handleChangeStatus("online") }}
                className={profilePopupButton + " " + profilePopupChild + " " + (status === "online" ? active : "")}>
              <div className={statusDot + " " + onlineDot + " " + positionAuto} />
              <p className={mL1}>Online</p>
            </div>
            <div
                onClick={() => { handleChangeStatus("away") }}
                className={profilePopupButton + " " + profilePopupChild + " " + (status === "away" ? active : "")}>
              <div className={statusDot + " " + awayDot + " " + positionAuto} />
              <p className={mL1}>Away</p>
            </div>
            <div
                onClick={() => { handleChangeStatus("dnd") }}
                className={profilePopupButton + " " + profilePopupChild + " " + (status === "dnd" ? active : "")}>
              <div
                  className={statusDot + " " + disturbDot + " " + positionAuto}
              />
              <p className={mL1}>Do not disturb</p>
            </div>
            <div
                onClick={() => { handleChangeStatus("invisible") }}
                className={profilePopupButton + " " + profilePopupChild + " " + (status === "invisible" ? active : "")}>
              <div
                  className={statusDot + " " + offlineDot + " " + positionAuto}
              />
              <p className={mL1}>Invisible</p>
            </div>
            <div className={profilePopupChild}>
              <button
                  onClick={handleLogout}
                  className={
                    button + " " + buttonSmall + " " + buttonSecondaryOutline + " " + wF
                  }
                  style={{border: "1px solid #ec808a"}}
              >
                Logout
              </button>
            </div>
          </div>
          <div
              ref={node}
              className={portal + " " + profile + (!isMobile() || width > MAX_MOBILE_WIDTH ? " " + bottom : " mobile")}
              style={{ background: `url(${avatar})` }}
          >
            <div className={statusDot + " " + (getStatusClass(status))} />
          </div>
        </div>
    );
  } else {
    return (
        <Link to="/login">
          <div className={portal + (!isMobile() ? " " + bottom : "")}>
            <LoginIcon width="28" className={icon} />
          </div>
        </Link>
    );
  }
}

export default Profile;
