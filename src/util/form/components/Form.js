// @flow

import React, { useEffect, useState } from "react";
import type { Node } from "react";
import PropTypes from "prop-types";

import FormContext from "../context";
import { GOTO, NEXT, usePartDispatch, usePartState } from "./part/context";

type Props = {
  submit: func,
  postSubmit: func,
  error?: ?string
};

type Field = {
  id: string,
  value?: any,
  validator?: func,
  valid: boolean,
  error?: string,
  showError: boolean,
  isRequired: boolean,
  partLoc: number
};

function Form(props: Props): Node {
  const dispatch = props.parts ? usePartDispatch() : undefined;

  let [manager, setManager] = useState({
    fields: [],
    showErrors: false,
    parts: props.parts,
    addField: addField,
    setValue: setValue,
    getField: getField,
    removeField: removeField,
    nextPart: nextPart,
    isVisible: isVisible,
    isValid: isValid,
    submit: submit
  });

  function addField(
    id,
    value = "",
    validator = null,
    partLoc = undefined,
    isRequired = false,
    liveErrors = false
  ): Field {
    let { fields } = manager;

    let field: Field = {
      id: id,
      value: value,
      validator: validator,
      valid: !isRequired,
      isRequired: isRequired,
      showError: liveErrors,
      partLoc: partLoc
    };

    fields.push(field);

    return field;
  }

  function setValue(id: string, value): boolean {
    let { fields } = manager;

    let field = fields.find(obj => obj.id === id);

    if (field === undefined) {
      return false;
    }

    field.value = value;

    setManager({ fields: fields, ...manager });

    return true;
  }

  function getField(id): Field {
    let { fields } = manager;

    return fields.find(obj => obj.id === id);
  }

  function removeField(id: string) {
    let { fields } = manager;

    fields.filter(obj => obj.id !== id);
  }

  function nextPart() {
    if (props.parts) {
      dispatch({ type: NEXT });
    }
  }

  function isVisible(partLoc) {
    if (!manager.parts) {
      return true;
    }

    const partState = usePartState();
    return partLoc === partState.position;
  }

  function isValid(): boolean {
    let { fields } = manager;

    let valid = true;
    let partLoc = undefined;

    fields.forEach(obj => {
      if (obj.validator === null) return;

      let error = obj.validator(obj.value, props.error);

      if (error === undefined) {
        obj.valid = true;
        obj.error = null;
      } else {
        if (obj.partLoc !== undefined) {
          partLoc = obj.partLoc;
        }
        valid = false;
        obj.valid = false;
        obj.error = error;
      }
    });

    if (props.parts && partLoc !== undefined) {
      dispatch({ type: GOTO, payload: partLoc });
    }

    setManager({ fields: fields, ...manager });

    return valid;
  }

  function submit(e) {
    e.preventDefault();
    e.stopPropagation();

    let { fields, showErrors } = manager;

    if (isValid()) {
      props.submit(fields);
      props.postSubmit();
    } else {
      showErrors = true;
      setManager({ showErrors: showErrors, ...manager });
    }
  }

  useEffect(() => {
    if (props.error !== null) {
      isValid();
    }
  }, [props.error]);

  return (
    <FormContext.Provider value={manager}>
      <form onSubmit={submit}>{props.children}</form>
    </FormContext.Provider>
  );
}

Form.propTypes = {
  submit: PropTypes.func.isRequired,
  postSubmit: PropTypes.func.isRequired
};

export default Form;
