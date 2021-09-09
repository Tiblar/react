import React from "react";
import axios from "axios";
import {toast} from "react-toastify";
import {Link} from "react-router-dom";
import {connect} from "react-redux";

import formStyles from "../../../../../../css/form.css";

import {API_URL} from "../../../../../../util/constants";

function FollowButton(props) {

    function handleFollow() {
        if(!props.auth.isAuthenticated || props.user.id === props.auth.user.id) return;

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        axios
            .post(API_URL + "/users/follow/" + props.user.id, {}, config)
            .then(res => {
                props.followCallback();
            })
            .catch(err => {
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

    function handleUnfollow() {
        if(!props.auth.isAuthenticated || props.user.id === props.auth.user.id) return;

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        axios
            .delete(API_URL + "/users/follow/" + props.user.id, config)
            .then(res => {
                props.unfollowCallback();
            })
            .catch(err => {
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

    return (
      <>
          {
              !props.auth.isAuthenticated &&
              <Link to={`/login`}
                    className={formStyles.button + ' ' + formStyles.buttonPrimary}>
                  Follow
              </Link>
          }
          {
              props.auth.isAuthenticated && !props.user.info.following &&
              <button disabled={props.user.id === props.auth.user.id || props.user.info.blocking}
                      onClick={handleFollow}
                      className={
                          formStyles.button + ' ' + formStyles.buttonPrimary
                      }>
                  Follow
              </button>
          }
          {
              props.auth.isAuthenticated && props.user.info.following &&
              <button disabled={props.user.id === props.auth.user.id}
                      onClick={handleUnfollow}
                      className={
                          formStyles.button + ' ' + formStyles.buttonPrimaryOutline
                      }>
                  Unfollow
              </button>
          }
      </>
    );
}

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth };
};

export default connect(mapStateToProps)(FollowButton);
