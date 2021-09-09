// @flow

import React, { useEffect, useCallback } from "react";
import ReactTooltip from "react-tooltip";

import { icon, portal } from "../../../../../css/layout/portal.css";

import GearIcon from "../../../../../assets/svg/icons/gear.svg";

import {
  CONTAINER,
  LAYER,
  useLayerDispatch
} from "../../layer/context";
import Container from "../settings/Container";
import Appearance from "../../../pages/settings/Appearance";

function Settings() {
  const dispatch = useLayerDispatch();

  const handleClick = e => {
    dispatch({ type: LAYER, payload: <Appearance /> });
    dispatch({ type: CONTAINER, payload: <Container /> });
  };

  return (
    <div>
      <div
        data-tip
        data-for="settings"
        className={portal}
        onClick={handleClick}
      >
        <GearIcon width="28" className={icon} />
      </div>
      <ReactTooltip id="settings" place="right" type="dark" effect="solid">
        <span>Settings</span>
      </ReactTooltip>
    </div>
  );
}

export default Settings;
