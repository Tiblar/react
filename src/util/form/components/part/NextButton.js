// @flow

import React from "react";
import type { Node } from "react";

import { button } from "../../../../css/form.css";
import PropTypes from "prop-types";
import { NEXT, usePartDispatch } from "./context";

function NextButton(props): Node {
  const dispatch = usePartDispatch();

  let classes = "";
  if (props.classes !== undefined) {
    classes = props.classes;
  }

  function onClick() {
    dispatch({ type: NEXT });
  }

  return (
    <button type="button" onClick={onClick} className={button + " " + classes}>
      Next
    </button>
  );
}

NextButton.propTypes = {
  classes: PropTypes.string
};

export default NextButton;
