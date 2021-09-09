// @flow

import React, {useEffect} from "react";

import {
  sidebar,
  sidebarContainer,
  sidebarItem,
  sidebarTitle,
  active,
  sidebarIcon,
  sidebarDivide
} from "../../../../../css/layout/social/settings/sidebar.css";

import IDIcon from "../../../../../assets/svg/icons/id.svg";
import UserIcon from "../../../../../assets/svg/icons/user.svg";
import StopIcon from "../../../../../assets/svg/icons/stop.svg";
import EyeIcon from "../../../../../assets/svg/icons/eyeSlash.svg";
import MoneyIcon from "../../../../../assets/svg/icons/dollarBill.svg";
import LinkIcon from "../../../../../assets/svg/icons/link.svg";
import RocketIcon from "../../../../../assets/svg/icons/rocket.svg";
import {
  useSettingsDispatch,
  useSettingsState,
  NAV_APPEARANCE,
  NAV_CONNECTIONS,
  NAV_ACCOUNT,
  NAV_BLOCKED,
  NAV_PRIVACY,
  NAV_FINANCIALS,
  NAV_UPGRADE,
  NAV
} from "./context";
import {LAYER, useLayerDispatch, useLayerState} from "../../layer/context";
import Appearance from "../../../pages/settings/Appearance";
import Connections from "../../../pages/settings/Connections";
import Account from "../../../pages/settings/Account";
import Upgrade from "../../../pages/settings/Upgrade";
import Blocked from "../../../pages/settings/Blocked";
import Privacy from "../../../pages/settings/Privacy";
import Financials from "../../../pages/settings/Financials";

function Nav() {
  const settingsDispatch = useSettingsDispatch();
  const layerDispatch = useLayerDispatch();

  let { nav } = useSettingsState();
  let { layer } = useLayerState();

  useEffect(() => {
    if(React.isValidElement(layer)){
      switch(layer.type.WrappedComponent.name) {
        case "Appearance":
          navigate(NAV_APPEARANCE)
          break;
        case "Financials":
          navigate(NAV_FINANCIALS)
          break;
        case "Upgrade":
          navigate(NAV_UPGRADE)
          break;
      }
    }
  }, [layer]);

  function isActive(section) {
    if (section === nav) {
      return active;
    }

    return "";
  }

  function navigate(section) {
    if(nav === section){
      return;
    }

    switch (section) {
      case NAV_APPEARANCE:
        layerDispatch({ type: LAYER, payload: <Appearance /> });
        break;
      case NAV_CONNECTIONS:
        layerDispatch({ type: LAYER, payload: <Connections /> });
        break;
      case NAV_ACCOUNT:
        layerDispatch({ type: LAYER, payload: <Account /> });
        break;
      case NAV_BLOCKED:
        layerDispatch({ type: LAYER, payload: <Blocked /> });
        break;
      case NAV_PRIVACY:
        layerDispatch({ type: LAYER, payload: <Privacy /> });
        break;
      case NAV_FINANCIALS:
        layerDispatch({ type: LAYER, payload: <Financials /> });
        break;
      case NAV_UPGRADE:
        layerDispatch({ type: LAYER, payload: <Upgrade /> });
        break;
      default:
        layerDispatch({ type: LAYER, payload: <Appearance /> });
        section = NAV_APPEARANCE;
        break;
    }

    settingsDispatch({ type: NAV, payload: section });
  }

  return (
      <div className={sidebar}>
        <div className={sidebarContainer}>
          <div className={sidebarItem + " " + sidebarTitle}>
            <label>settings</label>
          </div>
          <div
              onClick={() => {
                navigate(NAV_APPEARANCE);
              }}
              className={sidebarItem + " " + isActive(NAV_APPEARANCE)}
          >
            <div className={sidebarIcon}>
              <IDIcon width="100%" />
            </div>
            <span>Appearance</span>
          </div>
          <div
              onClick={() => {
                navigate(NAV_CONNECTIONS);
              }}
              className={sidebarItem + " " + isActive(NAV_CONNECTIONS)}
          >
            <div className={sidebarIcon}>
              <LinkIcon width="100%" />
            </div>
            <span>Connections</span>
          </div>
          <div
              onClick={() => {
                navigate(NAV_ACCOUNT);
              }}
              className={sidebarItem + " " + isActive(NAV_ACCOUNT)}
          >
            <div className={sidebarIcon}>
              <UserIcon width="100%" />
            </div>
            <span>Account</span>
          </div>
          <div
              onClick={() => {
                navigate(NAV_BLOCKED);
              }}
              className={sidebarItem + " " + isActive(NAV_BLOCKED)}
          >
            <div className={sidebarIcon}>
              <StopIcon width="100%" />
            </div>
            <span>Blocked</span>
          </div>
          <div
              onClick={() => {
                navigate(NAV_PRIVACY);
              }}
              className={sidebarItem + " " + isActive(NAV_PRIVACY)}
          >
            <div className={sidebarIcon}>
              <EyeIcon width="100%" />
            </div>
            <span>Privacy</span>
          </div>
          <div
              onClick={() => {
                navigate(NAV_FINANCIALS);
              }}
              className={sidebarItem + " " + isActive(NAV_FINANCIALS)}
          >
            <div className={sidebarIcon}>
              <MoneyIcon width="100%" />
            </div>
            <span>Financials</span>
          </div>
          <div className={sidebarDivide}>
            <hr />
          </div>
          <div
              onClick={() => {
                navigate(NAV_UPGRADE);
              }}
              className={sidebarItem + " " + isActive(NAV_UPGRADE)}
          >
            <div className={sidebarIcon}>
              <RocketIcon width="100%" />
            </div>
            <span>Upgrade</span>
          </div>
        </div>
      </div>
  );
}

export default Nav;
