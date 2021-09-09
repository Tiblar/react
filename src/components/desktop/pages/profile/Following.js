import React, {useState, useEffect, useRef} from "react";
import {connect} from "react-redux";
import {toast} from "react-toastify";
import axios from "axios";

import formStyles from "../../../../css/form.css";
import profileStyles from "../../../../css/layout/social/profile.css";
import layoutStyles from "../../../../css/layout.css";

import FrownIcon from "../../../../assets/svg/icons/frown.svg";

import ProfilePicture from "../../layout/parts/user/ProfilePicture";

import {useProfileState} from "../../layout/parts/profile/context";
import {API_URL, FOLLOW_LIMIT, FOLLOW_OFFSET} from "../../../../util/constants";
import ContentLoader from "../../../../util/components/ContentLoader";

function Following(props) {

    const { user } = useProfileState();
    const _isMounted = useRef(true);

    let [manager, setManager] = useState({
        error: false,
        following: [],
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

        axios.get(API_URL + '/users/profile/' + user.info.username + '/following', config)
            .then(function (res) {
                let {following} = manager;
                if(_isMounted.current && res.data.data.following){
                    setManager(manager => ({
                        ...manager,
                        following: following.concat(res.data.data.following),
                        loading: false,
                        offset: manager.offset + FOLLOW_OFFSET,
                        reachedEnd: res.data.data.following.length < 5,
                    }));
                }
            })
            .catch(function (err) {
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
            });
    }

    const FollowingLoader = (props) => (
        <ContentLoader
            width="100%"
            height="40"
            viewBox="0 0 100 40"
            preserveAspectRatio="none"
        >
            <rect x="0" y="0" rx="2" ry="2" width="100" height="40" />
        </ContentLoader>
    )

    let following = manager.following.map(following => (
        <div key={following.id} className={profileStyles.followProfile}>
            <ProfilePicture user={following} profilePreview={true} />
            <div className={profileStyles.followHeader}>
                <h3>{following.info.username}</h3>
                {
                    following.info.biography !== null &&
                    <div className={profileStyles.followBiography}>
                        {following.info.biography}
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
                        <h3>Following</h3>
                    </div>
                    <div className={profileStyles.body}>
                        {
                            manager.following.length === 0 && !manager.loading &&
                            <div className={profileStyles.followEmpty}>
                                <div className={formStyles.alert}>
                                    <FrownIcon width={20}/>
                                    {user.info.username} isn't following anyone.
                                </div>
                            </div>
                        }
                        {following}
                        {
                            manager.loading && <FollowingLoader />
                        }
                        {
                            !manager.loading && !manager.reachedEnd && manager.following.length !== 0 &&
                            <button
                                className={formStyles.button + ' ' + formStyles.buttonPrimary + ' ' + layoutStyles.mT1}
                                onClick={fetchUsers}>
                                Load more
                            </button>
                        }
                        {
                            manager.reachedEnd && manager.following.length !== 0 &&
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

export default connect(mapStateToProps)(Following);
