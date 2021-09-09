// @flow

import React, {useRef, useState, useEffect} from "react";
import PropTypes from "prop-types";
import axios from "axios";
import {isMobile} from "is-mobile";

import formStyles from "../../../../../../css/form.css";
import modalStyles from "../../../../../../css/components/modal.css";
import layoutStyles, {mL} from "../../../../../../css/layout.css";
import switchStyles from "../../../../../../css/components/switch.css";

import LoadingCircle from "../../../../../../assets/loading/dots.svg";

import outsideClick from "../../../../../../util/components/outsideClick";
import {API_URL} from "../../../../../../util/constants";
import {UPDATE_LOADING_LIST, useListsDispatch} from "./context";

const NewListModal = (props) => {

    const dispatch = useListsDispatch();

    const ref = useRef();
    const _isMounted = useRef(true);

    const [manager, setManager] = useState({
        title: "",
        description: "",
        private: true,
        loading: false,
        error: false,
    });

    useEffect(() => {
        return () => {
            _isMounted.current = false
        }
    }, []);

    function handleTitle(e) {
        let value = e.target.value;

        setManager(manager => ({
            ...manager,
            title: value,
        }))
    }

    function handleDescription(e) {
        let value = e.target.value;

        setManager(manager => ({
            ...manager,
            description: value,
        }))
    }

    function handlePrivate() {
        setManager(manager => ({
            ...manager,
            private: !manager.private,
        }))
    }

    function handleSubmit() {
        const config = {
            headers: {
                "Content-Type": "application/json"
            },
        };

        const data = {
            title: manager.title,
            description: manager.description,
            private: manager.private,
        }

        axios.post(API_URL + '/list', data, config)
            .then(function (res) {
                dispatch({ type: UPDATE_LOADING_LIST, payload: true })
                props.close();
            })
            .catch(function (err) {

            });
    }

    outsideClick(ref, () => {
        props.close();
    });

    return (
        <div className={modalStyles.containerOuter + (isMobile() ? (" " + modalStyles.mobile) : "")}>
            <div className={modalStyles.wrapper}>
                <div className={modalStyles.containerInner}>
                    <div className={modalStyles.modalContainer}>
                        <div className={modalStyles.modal} ref={ref}>
                            <div className={modalStyles.top}>
                                <div className={modalStyles.header}>
                                    <h4>New list</h4>
                                </div>
                            </div>
                            <div className={modalStyles.body + ' ' + layoutStyles.positionRelative}>
                                {
                                    manager.loading &&
                                    <div className={layoutStyles.flex + ' ' + layoutStyles.justifyContentCenter}>
                                        <LoadingCircle width="64px" />
                                    </div>
                                }
                                <div className={formStyles.formGroup}>
                                    <input type="text"
                                           maxLength={50}
                                           placeholder="Title"
                                           value={manager.title}
                                           onChange={handleTitle}
                                           className={formStyles.input} />
                                </div>
                                <div className={formStyles.formGroup}>
                                    <textarea
                                           placeholder="Description (optional)"
                                           maxLength={400}
                                           rows={8}
                                           value={manager.description}
                                           onChange={handleDescription}
                                           className={formStyles.input} />
                                </div>
                                <div className={formStyles.formGroup}>
                                    <div className={switchStyles.switchInput}>
                                        <p>
                                            <label>
                                                <input type="checkbox"
                                                       name="private"
                                                       checked={manager.private}
                                                       onChange={handlePrivate}/>
                                                <span>Private</span>
                                            </label>
                                        </p>
                                    </div>
                                    <small className={layoutStyles.mT1}>When a list is private, only you can see it.</small>
                                </div>
                            </div>
                            <div className={modalStyles.footer}>
                                <button className={formStyles.button} onClick={props.close}>Close</button>
                                <button className={formStyles.button + ' ' + formStyles.buttonPrimary + ' ' + mL}
                                        disabled={manager.title.length === 0}
                                        onClick={handleSubmit}>
                                    Create
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

NewListModal.propTypes = {
    close: PropTypes.func.isRequired,
}

export default NewListModal;