// @flow

import React, {useRef, useEffect, useState} from "react";
import PropTypes from "prop-types";
import axios from "axios";
import {Link} from "react-router-dom";
import {isMobile} from "is-mobile";

import formStyles from "../../../../../../../../css/form.css";
import modalStyles from "../../../../../../../../css/components/modal.css";
import layoutStyles from "../../../../../../../../css/layout.css";
import switchStyles from "../../../../../../../../css/components/switch.css";

import DotsLoading from "../../../../../../../../assets/loading/dots.svg";

import outsideClick from "../../../../../../../../util/components/outsideClick";

import {PostType} from "../../../../../../../../util/types/PostTypes";
import {API_URL} from "../../../../../../../../util/constants";

const ListModal = (props) => {
    const ref = useRef();

    const [manager, setManager] = useState({
        loadingLists: true,
        loadingActive: true,
        lists: [],
        activeLists: [],
        loading: false,
        error: false,
    });

    useEffect(() => {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        axios.get(API_URL + `/lists`, config)
            .then(function (res) {
                setManager(manager => ({
                    ...manager,
                    lists: res.data.data.lists,
                    loadingLists: false,
                }));
            })
            .catch(function (err) {
                setManager(manager => ({
                    ...manager,
                    error: true,
                    loading: false,
                }));
            });

        axios.get(API_URL + `/post/${props.post.id}/lists`, config)
            .then(function (res) {
                setManager(manager => ({
                    ...manager,
                    activeLists: res.data.data.lists,
                    loadingActive: false,
                }));
            })
            .catch(function (err) {
                setManager(manager => ({
                    ...manager,
                    error: true,
                    loading: false,
                }));
            });
    }, []);

    function handleUpdate(listId) {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        let {activeLists} = manager;

        let active = manager.activeLists.find(active => (
            active === listId
        ));

        if(active){
            axios.delete(API_URL + "/list/" + listId + "/" + props.post.id, config)
                .then(res => {
                   activeLists = activeLists.filter(list => list !== listId)

                    setManager(manager => ({
                        ...manager,
                        error: false,
                        loading: false,
                        activeLists: activeLists,
                    }));
                })
                .catch(err => {
                    setManager(manager => ({
                        ...manager,
                        error: true,
                        loading: false,
                    }));
                });
        }else{
            axios.post(API_URL + "/list/" + listId + "/" + props.post.id, config)
                .then(res => {
                    activeLists.push(listId);
                    setManager(manager => ({
                        ...manager,
                        error: false,
                        loading: false,
                        activeLists: activeLists,
                    }));

                })
                .catch(err => {
                    setManager(manager => ({
                        ...manager,
                        error: true,
                        loading: false,
                    }));
                });
        }
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
                                    <h4>Lists</h4>
                                </div>
                            </div>
                            <div className={modalStyles.body}>
                                {
                                    (!manager.loadingLists && !manager.loadingActive && manager.lists.length > 0) &&
                                    <div className={formStyles.formGroup}>
                                        {
                                            manager.lists.map(list => (
                                                <div key={list.id}>
                                                    <div className={layoutStyles.flex}>
                                                        {list.title}
                                                        <div className={switchStyles.switchInput + ' ' + layoutStyles.mL}>
                                                            <p>
                                                                <label>
                                                                    <input onChange={() => { handleUpdate(list.id) }}
                                                                           checked={manager.activeLists.some(active => (
                                                                               active === list.id
                                                                           ))}
                                                                           type="checkbox" />
                                                                    <span />
                                                                </label>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <hr />
                                                </div>
                                            ))
                                        }
                                    </div>
                                }
                                {
                                    (!manager.loadingLists && manager.lists.length === 0) &&
                                     <div className={formStyles.alert}>
                                         <div>
                                             You have no lists. You can&nbsp;<Link to={"/social/lists"}>create one</Link>.
                                         </div>
                                     </div>
                                }
                                {
                                    manager.loadingLists &&
                                    <div className={layoutStyles.flex + ' ' + layoutStyles.justifyContentCenter}>
                                        <DotsLoading width="25%" />
                                    </div>
                                }
                                {
                                    manager.error &&
                                    <div className={formStyles.alert + ' ' + formStyles.danger + ' ' + layoutStyles.mT1}>
                                        Something went wrong.
                                    </div>
                                }
                            </div>
                            <div className={modalStyles.footer}>
                                <button className={formStyles.button} onClick={props.close}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

ListModal.propTypes = {
    post: PostType.isRequired,
    close: PropTypes.func.isRequired,
}

export default ListModal;