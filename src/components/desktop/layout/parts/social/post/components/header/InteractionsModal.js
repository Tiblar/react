// @flow

import React, {useRef, useState, useEffect} from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import axios from "axios";
import PerfectScrollbar from "perfect-scrollbar";
import {isMobile} from "is-mobile";

import formStyles from "../../../../../../../../css/form.css";
import modalStyles from "../../../../../../../../css/components/modal.css";
import layoutStyles from "../../../../../../../../css/layout.css";
import nStyles from "../../../../../../../../css/components/notification.css";
import navStyles from "../../../../../../../../css/components/tabs-nav.css";

import LoadingCircle from "../../../../../../../../assets/loading/dots.svg";

import ProfilePicture from "../../../../user/ProfilePicture";
import outsideClick from "../../../../../../../../util/components/outsideClick";

import {PostType} from "../../../../../../../../util/types/PostTypes";
import {API_URL} from "../../../../../../../../util/constants";
import {numberToString} from "../../../../../../../../util/formatNumber";

const InteractionsModal = (props) => {
    const ref = useRef();
    const listRef = useRef();
    const _isMounted = useRef(true);

    const TAB_FAVORITES = "favorite";
    const TAB_REBLOGS = "reblog";

    const [manager, setManager] = useState({
        favoriters: [],
        rebloggers: [],
        loading: true,
        error: false,
        tab: TAB_FAVORITES,
    });

    function handleTabFavorites() {
        setManager(manager => ({
            ...manager,
            tab: TAB_FAVORITES,
        }));
    }

    function handleTabReblogs() {
        setManager(manager => ({
            ...manager,
            tab: TAB_REBLOGS,
        }));
    }

    useEffect(() => {
        return () => {
            _isMounted.current = false
        }
    }, []);

    useEffect(() => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        axios.get(API_URL + `/post/interactions/${props.post.id}`, config)
            .then(res => {
                if(res.data.data.reblog && res.data.data.favorite){
                    if(_isMounted.current){
                        setManager(manager => ({
                            ...manager,
                            rebloggers: res.data.data.reblog,
                            favoriters: res.data.data.favorite,
                            loading: false,
                        }));
                    }
                }
            })
            .catch(err => {
                setManager(manager => ({
                    ...manager,
                    error: true,
                    loading: false,
                }));
            });
    }, [manager.tab]);

    useEffect(() => {
        new PerfectScrollbar(listRef.current, {
            suppressScrollX: true
        })
    }, [listRef.current]);

    outsideClick(ref, () => {
        props.close();
    });

    return (
        <div className={modalStyles.containerOuter + (isMobile() ? (" " + modalStyles.mobile) : "")}>
            <div className={modalStyles.wrapper}>
                <div className={modalStyles.containerInner}>
                    <div className={modalStyles.modalContainer}>
                        <div className={modalStyles.modal} ref={ref}>
                            <div className={navStyles.nav}>
                                <div className={navStyles.pages}>
                                    <div onClick={handleTabFavorites} className={navStyles.page}>
                                        <label>Favorites</label>
                                        {
                                            manager.tab === TAB_FAVORITES &&
                                            <span className={navStyles.active}/>
                                        }
                                    </div>
                                    <div onClick={handleTabReblogs} className={navStyles.page}>
                                        <label>Reblogs</label>
                                        {
                                            manager.tab === TAB_REBLOGS &&
                                            <span className={navStyles.active}/>
                                        }
                                    </div>
                                </div>
                                <div className={layoutStyles.flex + ' ' + layoutStyles.alignItemsCenter + ' ' + layoutStyles.mL}>
                                    <small>{numberToString(props.post.views)} views</small>
                                </div>
                            </div>
                            <div className={modalStyles.body + ' ' + layoutStyles.positionRelative} style={{height: "400px"}}>
                                <div className={nStyles.listContainer} ref={listRef}>
                                    {
                                        manager.loading &&
                                        <div className={layoutStyles.flex + ' ' + layoutStyles.justifyContentCenter}>
                                            <LoadingCircle width="64px" />
                                        </div>
                                    }
                                    {
                                        (manager.tab === TAB_REBLOGS && manager.rebloggers) && manager.rebloggers.map((user, i) => (
                                            <Link className={
                                                layoutStyles.flex + ' ' + layoutStyles.alignItemsCenter + ' ' + nStyles.user
                                            } to={`/${user.info.username}`} key={user.id}>
                                                <ProfilePicture user={user} small={true} />
                                                <p className={layoutStyles.mL1}>
                                                    {user.info.username}
                                                </p>
                                            </Link>
                                        ))
                                    }
                                    {
                                        (manager.tab === TAB_REBLOGS && manager.rebloggers.length === 0 && !manager.loading) &&
                                        <div className={layoutStyles.alert + ' ' + layoutStyles.m1}>
                                            <p>There are no people here.</p>
                                        </div>
                                    }
                                    {
                                        (manager.tab === TAB_FAVORITES && manager.favoriters) && manager.favoriters.map((user, i) => (
                                            <Link className={
                                                layoutStyles.flex + ' ' + layoutStyles.alignItemsCenter + ' ' + nStyles.user
                                            } to={`/${user.info.username}`} key={user.id}>
                                                <ProfilePicture user={user} small={true} />
                                                <p className={layoutStyles.mL1}>
                                                    {user.info.username}
                                                </p>
                                            </Link>
                                        ))
                                    }
                                    {
                                        (manager.tab === TAB_FAVORITES && manager.favoriters.length === 0 && !manager.loading) &&
                                        <div className={layoutStyles.alert + ' ' + layoutStyles.m1}>
                                            <p>There are no people here.</p>
                                        </div>
                                    }
                                </div>
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

InteractionsModal.propTypes = {
    post: PostType.isRequired,
    close: PropTypes.func.isRequired,
}

export default InteractionsModal;