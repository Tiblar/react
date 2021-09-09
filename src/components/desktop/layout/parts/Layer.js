// @flow

import React from "react";

import { layer } from "../../../../css/layout.css";

function Layer(props) {
  return <div className={layer}>{props.children}</div>;
}

export default Layer;
