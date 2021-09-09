// @flow

import React, {useRef, useState, useEffect} from "react";
import PropTypes from "prop-types";
import axios from "axios";
import {toast} from "react-toastify";
import {isMobile} from "is-mobile";

import formStyles from "../../../../../../css/form.css";
import modalStyles from "../../../../../../css/components/modal.css";
import layoutStyles, {mL} from "../../../../../../css/layout.css";
import switchStyles from "../../../../../../css/components/switch.css";

import LoadingCircle from "../../../../../../assets/loading/dots.svg";

import outsideClick from "../../../../../../util/components/outsideClick";
import {API_URL} from "../../../../../../util/constants";
import history from "../../../../../../util/history";
import {connect} from "react-redux";

const EditListModal = (props) => {

    const ref = useRef();
    const _isMounted = useRef(true);

    const [manager, setManager] = useState({
        title: props.list.title,
        description: props.list.description,
        private: props.list.visibility === "PRIVATE",
        loading: false,
        error: false,
        delete: false,
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

        axios.patch(API_URL + '/list/' + props.list.id, data, config)
            .then(function (res) {
                props.handleLoadList()
                props.close();
            })
            .catch(function (err) {
                const Notification = () => (
                    <div>
                        There was an error
                    </div>
                );
                setTimeout(() => {

                    toast.error(<Notification />, {
                        position: "bottom-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }, 300);
            });
    }

    function handleDelete() {
        const config = {
            headers: {
                "Content-Type": "application/json"
            },
        };

        axios.delete(API_URL + '/list/' + props.list.id, config)
            .then(function (res) {
                if(props.portal.portal === "VIDEO"){
                    history.push("/video/lists");
                }else{
                    history.push("/social/lists");
                }
            })
            .catch(function (err) {
                const Notification = () => (
                    <div>
                        There was an error
                    </div>
                );
                setTimeout(() => {

                    toast.error(<Notification />, {
                        position: "bottom-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }, 300);
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
                                <hr />
                                <div className={formStyles.formGroup}>
                                    {
                                        !manager.delete &&
                                        <a className={layoutStyles.pointer} onClick={() => { setManager(manager => ({ ...manager, delete: true })) }}>
                                            Delete list
                                        </a>
                                    }
                                    {
                                        manager.delete &&
                                        <div className={layoutStyles.flex}>
                                            <button className={formStyles.button + ' ' + formStyles.buttonSecondary} onClick={handleDelete}>
                                                Confirm Deletion
                                            </button>
                                            <button className={formStyles.button + ' ' + layoutStyles.mL1}
                                                    onClick={() => { setManager(manager => ({ ...manager, delete: false })) }}>
                                                Cancel
                                            </button>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className={modalStyles.footer}>
                                <button className={formStyles.button} onClick={props.close}>Close</button>
                                <button className={formStyles.button + ' ' + formStyles.buttonPrimary + ' ' + mL}
                                        disabled={manager.title.length === 0}
                                        onClick={handleSubmit}>
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = state => {
    const { portal } = state;
    return { portal: portal };
};

EditListModal.propTypes = {
    close: PropTypes.func.isRequired,
}

export default connect(mapStateToProps)(EditListModal);
