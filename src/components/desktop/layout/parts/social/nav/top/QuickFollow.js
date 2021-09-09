// @flow

import React, {useState, forwardRef, useEffect, useRef} from "react";
import axios from "axios";
import PerfectScrollbar from "perfect-scrollbar";
import ReactTooltip from "react-tooltip";

import formStyles, {alert, button, buttonIcon, buttonSmall} from "../../../../../../../css/form.css";
import {
    container,
    divide, item,
    listContainer,
} from "../../../../../../../css/layout/chat/pc/new-pc.css";
import {input, search, searchIcon} from "../../../../../../../css/components/search.css";
import layoutStyles from "../../../../../../../css/layout.css";

import SearchIcon from "../../../../../../../assets/svg/icons/search.svg";
import FrownIcon from "../../../../../../../assets/svg/icons/frown.svg";
import PlusIcon from "../../../../../../../assets/svg/icons/plus.svg";
import TimesIcon from "../../../../../../../assets/svg/icons/times.svg";

import {API_URL} from "../../../../../../../util/constants";
import {toast} from "react-toastify";
import {connect} from "react-redux";

function QuickFollow(props) {
    const [manager, setManager] = useState({
        users: [],
        create: {
            active: false,
            userId: null,
        }
    });
    const containerRef = useRef();
    const scrollRef = useRef();
    const _isMounted = useRef(true);

    useEffect(() => {
        return () => {
            _isMounted.current = false
        }
    }, []);

    useEffect(() => {
        scrollRef.current = new PerfectScrollbar(containerRef.current, {
            suppressScrollX: true
        });
    }, [containerRef.current]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if(scrollRef.current && _isMounted.current){
                scrollRef.current.update();
            }
        }, 200);

        return () => {
            clearTimeout(timeout);
        };
    }, [scrollRef.current])

    function fetchUsers(e) {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            params: {
                username: e.target.value
            }
        };

        axios.get(API_URL + "/search/social/profiles", config).then(res => {
            if(res.data.data.profiles){
                setManager((manager) => ({
                    ...manager,
                    users: res.data.data.profiles
                }));
            }
        });
    }

    function handleFollow(id) {
        let user = manager.users.find(obj => obj.id === id);

        axios({
            url: API_URL + "/users/follow/" + id,
            headers: {
                "Content-Type": "application/json"
            },
            method: user.info.following ? "delete" : "post",
        }).then(res => {
            let {users} = manager;
            let user = users.find(obj => obj.id === id);
            user.info.following = !user.info.following;

            setManager(manager => ({
                ...manager,
                users: users,
            }));
        }).catch(err => {
            const Notification = () => (
                <div>
                    There was an error!
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
            }, 800);
        });
    }

    let userList = manager.users.map(user => (
        <div className={item} key={user.id}>
            <span>{user.info.username}</span>
            <ReactTooltip id={`follow-${user.id}`} place="bottom" type="dark" effect="solid">
                {user.info.following && <span>Unfollow</span>}
                {!user.info.following && <span>Follow</span>}
            </ReactTooltip>
            {
                (props.auth.user !== null && (user.id !== props.auth.user.id)) &&
                <button
                    data-tip data-for={`follow-${user.id}`}
                    className={layoutStyles.mL + " " + button + " " + buttonIcon + " " + buttonSmall}
                    onClick={() => { handleFollow(user.id) }}
                >
                    {!user.info.following && <PlusIcon height={18} />}
                    {user.info.following && <TimesIcon height={18} />}
                </button>
            }
        </div>
    ));

    return (
        <div className={container}>
            <div className={
                layoutStyles.positionRelative + ' ' + layoutStyles.wF
                + ' ' + layoutStyles.flex + ' ' + layoutStyles.flexColumn
            }>
                <div className={search + ' ' + layoutStyles.mLN} style={{ width: "100%" }}>
                    <div className={searchIcon}>
                        <SearchIcon width="20" />
                    </div>
                    <input
                        className={input}
                        onChange={fetchUsers}
                        placeholder="Search users..."
                    />
                </div>
                <div className={divide}>
                    <hr />
                </div>
                <div className={layoutStyles.positionRelative + ' ' + layoutStyles.flexGrow}>
                    <div className={listContainer} ref={containerRef}>
                        {manager.users.length === 0 && (
                            <div className={alert}>
                                <FrownIcon width="18" />
                                There are no users here.
                            </div>
                        )}
                        {manager.users.length > 0 && userList}
                    </div>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth };
};

export default connect(mapStateToProps)(QuickFollow);
