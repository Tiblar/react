// @flow

import React from "react";
import type { Node } from "react";

import { partContainer } from "../../../../css/form.css";

function PartBody(props): Node {
  return <div className={partContainer}>{props.children}</div>;
}

export default PartBody;
