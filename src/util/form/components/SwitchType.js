// @flow

import React, { useContext } from "react";

import {
  lever,
  switchInput
} from "../../../css/components/switch.css";

import FormContext from "../context";

type Props = {
  id: string,
  purple?: boolean
};

function SwitchType(props: Props) {
  const context = useContext(FormContext);

  let id = props.id;
  let field = context.getField(id);
  let value = typeof props.checked != "undefined" ? props.checked : false;

  if (typeof field == "undefined") {
    field = context.addField(id, value);
  }

  function onChange(e) {
    context.setValue(field.id, e.target.checked);
  }

  return (
    <div className={switchInput}>
      <label>
        <input
          checked={field.value === true ? "checked" : ""}
          onChange={onChange}
          type="checkbox"
        />{" "}
        <span
          className={props.purple === true ? lever + " " + lever : lever}
        />{" "}
        {props.label}
      </label>
    </div>
  );
}

export default SwitchType;
