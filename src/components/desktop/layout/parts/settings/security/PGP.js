// @flow

import React, { useState } from "react";
import { connect } from "react-redux";
import { key } from "openpgp";

import {
  button,
  buttonSuccess,
  input,
  formGroup,
  invalidLabel,
  validLabel
} from "../../../../../../css/form.css";

import CheckIcon from "../../../../../../assets/svg/icons/check.svg";
import KeyIcon from "../../../../../../assets/svg/icons/key.svg";

const pgpCode = "";

function PGP() {
  let [state, setState] = useState({
    key: "",
    valid: null,
    verified: false,
    sent: false,
    code: ""
  });

  const validatePGP = async e => {
    let value = e.target.value;

    let keys = await key.readArmored(value);

    let valid =
      keys.keys.length !== 0 &&
      keys.keys[0].keyPacket.constructor.name === "PublicKey";

    setState({
      ...state,
      key: value,
      valid: valid
    });
  };

  function saveKey() {
    setState({
      ...state,
      sent: true,
      code: pgpCode
    });
  }

  function Verify() {
    return (
      <div>
        <div className={formGroup}>
          <label>
            <KeyIcon width="12" />
            Please decrypt the following message:
          </label>
          <textarea
            readOnly
            value={state.code}
            className={input}
            rows="5"
            placeholder="Paste a valid PGP key"
          />
        </div>
        <div className={formGroup}>
          <input
            className={input}
            placeholder="Paste decrypted message here."
          />
        </div>
        <div className={formGroup}>
          <button className={button + " " + buttonSuccess}>
            <CheckIcon height="15" />
            Verify
          </button>
        </div>
      </div>
    );
  }

  function DefaultState(props) {
    return (
      <div className={formGroup}>
        {props.valid === false && (
          <label className={invalidLabel}>Invalid public PGP key</label>
        )}
        <textarea
          onChange={validatePGP}
          value={state.key}
          className={input}
          rows="5"
          placeholder="Paste a valid PGP key"
        />
      </div>
    );
  }

  function ValidState() {
    return (
      <div>
        <div className={formGroup}>
          <label className={validLabel}>
            <CheckIcon width="12" />
            Valid PGP key
          </label>
          <textarea
            onChange={validatePGP}
            value={state.key}
            className={input}
            rows="5"
            placeholder="Paste a valid PGP key"
          />
        </div>
        <div className={formGroup}>
          <button onClick={saveKey} className={button + " " + buttonSuccess}>
            Save
          </button>
        </div>
      </div>
    );
  }

  if (state.valid === true && state.verified === false && state.sent === true) {
    return <Verify />;
  }

  if (state.valid === null || state.valid === false) {
    return <DefaultState valid={state.valid} />;
  }

  if (state.valid === true) {
    return <ValidState />;
  }
}

const mapStateToProps = state => {
  const { auth } = state;
  return { auth: auth };
};

export default connect(mapStateToProps)(PGP);
