// @flow

import React, { createRef, useContext, useEffect } from "react";

import { input, invalidInput, invalidLabel } from "../../../css/form.css";
import { flex, flexGrow } from "../../../css/layout.css";

import FormContext from "../context";

type Props = {
  id: string
};

function TextType(props: Props) {
  const context = useContext(FormContext);
  const typeRef = createRef();

  let id = props.id;
  let liveErrors = props.liveErrors === true;
  let isRequired = props.isRequired === true;
  let validator = typeof props.validator == "function" ? props.validator : null;
  let partLoc = props.partLoc;
  let field = context.getField(id);
  let value = typeof props.value != "undefined" ? props.value : "";
  let isInvalid = flex + " " + flexGrow;
  let errorText = "";
  let autofocus =
    typeof props.autofocus != "undefined" &&
    props.autofocus &&
    context.isVisible(partLoc);

  if (typeof field == "undefined") {
    field = context.addField(
      id,
      value,
      validator,
      partLoc,
      isRequired,
      liveErrors
    );
  }

  if (context.showErrors === false && field.valid === false) {
    isInvalid = invalidInput;
    errorText = field.error;
  }

  useEffect(() => {
    if (autofocus) {
      typeRef.current.focus();
    }
  }, [autofocus]);

  function onChange(e) {
    context.setValue(field.id, e.target.value);
  }

  function checkEnter(e) {
    if (props.nextPart && e.key === "Enter") {
      context.nextPart();
    }

    if (props.submitEnter && e.key === "Enter") {
      context.submit(e);
    }
  }

  return (
    <div className={isInvalid}>
      <label className={invalidLabel}>{errorText}</label>
      <input
        type="text"
        ref={typeRef}
        autoComplete="off"
        autoCapitalize="off"
        onChange={onChange}
        onKeyPress={checkEnter}
        value={field.value}
        maxLength={props.maxLength}
        placeholder={props.placeholder}
        className={input}
      />
    </div>
  );
}

export default TextType;
