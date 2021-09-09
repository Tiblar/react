// @flow

import React from "react";
import ReactTooltip from "react-tooltip";

import { icon, portal } from "../../../../../css/layout/portal.css";

import UpgradeIcon from "../../../../../assets/svg/icons/rocket.svg";

import {
  CONTAINER,
  LAYER,
  useLayerDispatch
} from "../../layer/context";
import Container from "../settings/Container";
import { default as Page } from "../../../pages/settings/Upgrade";
import {connect} from "react-redux";

function Upgrade(props) {
  const dispatch = useLayerDispatch();

  const handleClick = e => {
    dispatch({ type: LAYER, payload: <Page /> });
    dispatch({ type: CONTAINER, payload: <Container /> });
  };

  if(props.auth.user !== null && props.auth.user.boosted){
      return null;
  }

  return (
    <div>
      <div data-tip data-for="upgrade" className={portal} onClick={handleClick}>
        <UpgradeIcon width="28" className={icon} />
      </div>
      <ReactTooltip id="upgrade" place="right" type="dark" effect="solid">
        <span>Boost</span>
      </ReactTooltip>
    </div>
  );
}

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth };
};

export default connect(mapStateToProps)(Upgrade);
