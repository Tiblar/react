// @flow

import React, { useContext } from "react";

import { withGap } from "../../../css/components/radio.css";
import { flex, mL } from "../../../css/layout.css";

import FormContext from "../context";

type Props = {
  id: string,
  name: string,
  radios: Array
};

function RadioType(props: Props) {
  const context = useContext(FormContext);

  let id = props.id;
  let field = context.getField(id);
  let value = typeof props.value != "undefined" ? props.value : null;

  if (typeof field == "undefined") {
    field = context.addField(id, value);
  }

  function onChange(e) {
    context.setValue(field.id, e.target.checked);
  }

  function normalFormat(radios) {
    return radios.map(radio => (
      <div
        key={Math.random()
          .toString(36)
          .substring(7)}
      >
        <label>
          <input name={props.name} className={withGap} type="radio" />
          <span>{radio.title}</span>
        </label>
      </div>
    ));
  }

  function rightFormat(radios) {
    return radios.map(radio => (
      <div
        key={Math.random()
          .toString(36)
          .substring(7)}
        className={flex}
      >
        <p>{radio.title}</p>
        <label className={mL}>
          <input name={props.name} className={withGap} type="radio" />
          <span></span>
        </label>
      </div>
    ));
  }

  let radios =
    props.right === true
      ? rightFormat(props.radios)
      : normalFormat(props.radios);

  return <div>{radios}</div>;
}

export default RadioType;
