// @flow

import React, { useEffect } from "react";
import type { Node } from "react";
import PropTypes from "prop-types";

import { part, showPart, hidePart } from "../../../../css/form.css";
import { ADD_PART, usePartDispatch, usePartState } from "./context";

type Props = {
  pos: number
};

function Part(props: Props): Node {
  const context = usePartState();
  const dispatch = usePartDispatch();

  let pos = props.pos;
  let data = context.parts[pos];
  let visible = context.position === pos;

  if (data !== undefined) {
    visible = data.visible;
  }

  useEffect(() => {
    dispatch({ type: ADD_PART, payload: { visible: visible } });
  }, [pos]);

  let show = visible === true ? showPart : hidePart;

  return <div className={part + " " + show}>{props.children}</div>;
}

Part.propTypes = {
  pos: PropTypes.number.isRequired
};

export default Part;
