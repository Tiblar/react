// @flow

import React from "react";

import { REVERT, useLayerState } from "./context";

function LayerManager() {
  let { container } = useLayerState();

  return <div>{container !== null && container !== REVERT && container}</div>;
}

export default LayerManager;
