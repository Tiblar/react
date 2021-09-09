// @flow

import React, {useState, useEffect, useRef} from "react";
import {connect} from "react-redux";
import axios from "axios";
import {toast} from "react-toastify";
import PropTypes from "prop-types";

import layoutStyles from "../../../../../../../css/layout.css";
import cardStyles from "../../../../../../../css/components/card.css";

import EmptyGraphic from "../../../../../../../assets/graphics/requests.svg";

import Request from "../Request";

import {API_URL, MAX_MOBILE_WIDTH} from "../../../../../../../util/constants";
import store from "../../../../../../../store";
import {updateSocialNotificationsCount} from "../../../../../../../reducers/notifications/actions";
import ContentLoader from "../../../../../../../util/components/ContentLoader";
import useWindowDimensions from "../../../../../../../util/hooks/useWindowDimensions";

function RequestTab(props) {
    const {width} = useWindowDimensions();
    const _isMounted = useRef(true);

    const [manager, setManager] = useState({
        requests: [],
        loading: true,
    });

    useEffect(() => {
        return () => {
            _isMounted.current = false
        }
    }, []);

    useEffect(() => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            }
        };

        axios.get(API_URL + "/users/@me/follow/requests", config).then(res => {
            if(res.data.data.incoming){
                store.dispatch(updateSocialNotificationsCount());

                if(_isMounted.current){
                    setManager(manager => ({
                        ...manager,
                        requests: res.data.data.incoming,
                        loading: false,
                    }));
                }
            }
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
            }, 300);
        })
    }, [])


    function handleAccept(id) {
        let {requests} = manager;

        requests = requests.filter(obj => obj.id !== id);

        const config = {
            headers: {
                "Content-Type": "application/json",
            }
        };

        axios.post(API_URL + "/users/follow/request/" + id + "/accept", config).then(res => {
            store.dispatch(updateSocialNotificationsCount());

            if(res.data.data.follow){
                setManager(manager => ({
                    ...manager,
                    requests: requests,
                }))
            }
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
            }, 300);
        })
    }

    function handleDelete(id) {
        let {requests} = manager;

        requests = requests.filter(obj => obj.id !== id);

        const config = {
            headers: {
                "Content-Type": "application/json",
            }
        };

        axios.delete(API_URL + "/users/follow/request/" + id + "/reject", config).then(res => {
            store.dispatch(updateSocialNotificationsCount());

            setManager(manager => ({
                ...manager,
                requests: requests,
            }))
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
            }, 300);
        })
    }

    const ProfileLoader = (props) => (
        <ContentLoader
            width="100%"
            speed={1}
            viewBox="0 0 400 60"
        >
            <circle cx="27" cy="27" r="18" />
            <rect x="53" y="14" rx="3" ry="3" width="240" height="13" />
            <rect x="53" y="30" rx="3" ry="3" width="10" height="10" />
            <rect x="67" y="30" rx="3" ry="3" width="120" height="10" />
            <circle cx="380" cy="27" r="8" />
            <rect x="0" y="53" rx="0" ry="0" width="400" height="1" />
            <rect x="219" y="146" rx="0" ry="0" width="0" height="0" />
        </ContentLoader>
    )

    return (
        <main>
            {
                manager.requests.length === 0 && !manager.loading && !props.noCard && width > MAX_MOBILE_WIDTH &&
                <div className={cardStyles.card + ' ' + layoutStyles.mT1}>
                    <div className={cardStyles.cardBody}>
                        <EmptyGraphic />
                    </div>
                </div>
            }
            {
                manager.requests.length === 0 && !manager.loading && (props.noCard || width <= MAX_MOBILE_WIDTH) &&
                <EmptyGraphic />
            }
            {
                manager.loading &&
                <div className={layoutStyles.mT1}>
                    {
                        [...Array(4)].map((e, i) => <ProfileLoader key={i} />)
                    }
                    <ProfileLoader />
                </div>
            }
            {
                manager.requests.map((request) =>
                    <Request key={request.id} request={request} handleAccept={handleAccept} handleDelete={handleDelete} />
                )
            }
        </main>
    );
}

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth };
};

RequestTab.propTypes = {
    noCard: PropTypes.bool
};

RequestTab.defaultProps = {
    noCard: false,
};

export default connect(mapStateToProps)(RequestTab);
