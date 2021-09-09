// @flow

import React, {useRef} from "react";
import {isMobile} from "is-mobile";

import formStyles from "../../../../css/form.css";
import modalStyles from "../../../../css/components/modal.css";
import {
    mL
} from "../../../../css/layout.css";
import outsideClick from "../../../../util/components/outsideClick";

const ConfirmModal = (props) => {
    const ref = useRef();

    outsideClick(ref, () => {
       props.cancel();
    });

    return (
        <div className={modalStyles.containerOuter + (isMobile() ? (" " + modalStyles.mobile) : "")}>
            <div className={modalStyles.wrapper}>
                <div className={modalStyles.containerInner}>
                    <div className={modalStyles.modalContainer}>
                        <div className={modalStyles.modal} ref={ref}>
                            <div className={modalStyles.top}>
                                <div className={modalStyles.header}>
                                    <h4>{props.header}</h4>
                                </div>
                            </div>
                            <div className={modalStyles.body}>
                                <div className={formStyles.alert}>{props.body}</div>
                            </div>
                            <div className={modalStyles.footer}>
                                <button className={formStyles.button} onClick={props.cancel}>Close</button>
                                <button className={formStyles.button + ' ' + formStyles.buttonPrimary + ' ' + mL} onClick={props.callback}>Continue</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;