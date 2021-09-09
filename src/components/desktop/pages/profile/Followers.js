import React, {useState, useEffect, useRef} from "react";
import {connect} from "react-redux";
import {toast} from "react-toastify";
import axios from "axios";

import formStyles from "../../../../css/form.css";
import profileStyles from "../../../../css/layout/social/profile.css";

import FrownIcon from "../../../../assets/svg/icons/frown.svg";

import ProfilePicture from "../../layout/parts/user/ProfilePicture";

import {useProfileState} from "../../layout/parts/profile/context";
import {API_URL, FOLLOW_LIMIT, FOLLOW_OFFSET} from "../../../../util/constants";
import layoutStyles from "../../../../css/layout.css";

import ContentLoader from "../../../../util/components/ContentLoader";

function Followers(props) {
    const { user } = useProfileState();
    const _isMounted = useRef(true);

    let [manager, setManager] = useState({
        error: false,
        followers: [],
        loading: true,
        offset: 0,
        reachedEnd: false,
    });

    useEffect(() => {
        return () => {
            _isMounted.current = false
        }
    }, []);

    useEffect(() => {
        if(user === null){
            return;
        }

      fetchUsers();
    }, [user]);

    function fetchUsers() {
        setManager(manager => ({
            ...manager,
            loading: true,
        }));

        const config = {
            headers: {
                "Content-Type": "application/json"
            },
            params: {
                offset: manager.offset,
                limit: FOLLOW_LIMIT,
            }
        };

        axios.get(API_URL + '/users/profile/' + user.info.username + '/followers', config)
            .then(function (res) {
                let {followers} = manager;
                if(_isMounted.current && res.data.data.followers) {
                    setManager(manager => ({
                        ...manager,
                        followers: followers.concat(res.data.data.followers),
                        loading: false,
                        offset: manager.offset + FOLLOW_OFFSET,
                        reachedEnd: res.data.data.followers.length < 5,
                    }));
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

    const FollowersLoader = (props) => (
        <ContentLoader
            width="100%"
            height="40"
            viewBox="0 0 100 40"
            preserveAspectRatio="none"
        >
            <rect x="0" y="0" rx="2" ry="2" width="100" height="40" />
        </ContentLoader>
    )

    let followers = manager.followers.map(followers => (
        <div key={followers.id} className={profileStyles.followProfile}>
            <ProfilePicture user={followers} profilePreview={true} />
            <div className={profileStyles.followHeader}>
                <h3>{followers.info.username}</h3>
                {
                    followers.info.biography !== null &&
                    <div className={profileStyles.followBiography}>
                        {followers.info.biography}
                    </div>
                }
            </div>
        </div>
    ));

    return (
        <div className={profileStyles.container}>
            {
                user !== null &&
                <div className={profileStyles.card}>
                    <div className={profileStyles.top}>
                        <h3>Followers</h3>
                    </div>
                    <div className={profileStyles.body}>
                        {
                            manager.followers.length === 0 && !manager.loading &&
                            <div className={profileStyles.followEmpty}>
                                <div className={formStyles.alert}>
                                    <FrownIcon width={20}/>
                                    {user.info.username} doesn't have any followers.
                                </div>
                            </div>
                        }
                        {followers}
                        {
                            manager.loading && <FollowersLoader />
                        }
                        {
                            !manager.loading && !manager.reachedEnd && manager.followers.length !== 0 &&
                            <button
                                className={formStyles.button + ' ' + formStyles.buttonPrimary + ' ' + layoutStyles.mT1}
                                onClick={fetchUsers}>
                                Load more
                            </button>
                        }
                        {
                            manager.reachedEnd && manager.followers.length !== 0 &&
                            <div className={formStyles.alert + ' ' + layoutStyles.mT1}>
                                <FrownIcon width={20}/>
                                You have reached the end.
                            </div>
                        }
                    </div>
                </div>
            }
        </div>
    );
}

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth };
};

export default connect(mapStateToProps)(Followers);
