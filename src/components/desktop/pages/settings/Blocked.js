// @flow

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";

import {
  card,
  cardBody
} from "../../../../css/layout/social/settings/card.css";
import {
  blocked,
  unblocked
} from "../../../../css/layout/social/settings/pages/blocked.css";
import { button, input, formGroup, alert } from "../../../../css/form.css";
import {
  mL1,
  mL,
  mB1,
  tbRowM,
  tbCol12,
  flex,
  flexRow,
  alignItemsCenter
} from "../../../../css/layout.css";

import BlockedIcon from "../../../../assets/svg/icons/times.svg";
import CheckIcon from "../../../../assets/svg/icons/check.svg";
import SmileIcon from "../../../../assets/svg/icons/smile.svg";
import FrownIcon from "../../../../assets/svg/icons/frown.svg";
import LoadingGraphic from "../../../../assets/loading/dots.svg";

import ProfilePicture from "../../layout/parts/user/ProfilePicture";

import {API_URL} from "../../../../util/constants";
import {toast} from "react-toastify";

function Blocked(props) {
  let [manager, setManager] = useState({
    filter: "",
    loading: true,
    error: false,
    users: [],
  });

  useEffect(() => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      }
    };

    axios.get(API_URL + "/users/@me/blocked", config).then(res => {
      if(res.data.data.users && Array.isArray(res.data.data.users)){
        setManager(manager => ({
          ...manager,
          users: res.data.data.users,
          loading: false,
        }));

        return;
      }

      setManager(manager => ({
        ...manager,
        error: true,
        loading: false,
      }));
    }).catch(err => {
      setManager(manager => ({
        ...manager,
        error: true,
        loading: false,
      }));
    });
  }, []);

  function filterUsers(e) {
    let value = e.target.value;

    setManager(manager => ({
      ...manager,
      filter: value
    }));
  }

  function handleBlock(id)
  {
    let { users } = manager;
    let user = users.find(obj => obj.id === id);

    if(!props.auth.isAuthenticated || user.id === props.auth.user.id) return;

    axios({
      method: user.info.blocking ? 'delete' : 'post',
      url: API_URL + "/users/block/" + user.id,
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => {
      user.info.blocking = !user.info.blocking;
      user.info.followed_by = false;
      user.info.following = false;

      setManager(manager => ({
        ...manager,
        users: users,
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
    });
  }

  let filtered = manager.users.filter(user => {
    return (
      user.info.username.toLowerCase().startsWith(manager.filter.toLowerCase()) ||
      manager.filter === ""
    );
  });

  let blockedUsers = filtered.map(user => {
    return (
      <div className={tbRowM + " " + mB1} key={user.id}>
        <div className={tbCol12}>
          <div className={card}>
            <div
              className={
                cardBody + " " + flex + " " + flexRow + " " + alignItemsCenter
              }
            >
              <ProfilePicture user={user} />
              <div className={mL1}>
                <p>{user.info.username}</p>
                {user.info.blocking && (
                  <p className={blocked}>
                    <BlockedIcon width="10" />
                    blocked
                  </p>
                )}
                {!user.info.blocking && (
                  <p className={unblocked}>
                    <CheckIcon width="10" />
                    not blocked
                  </p>
                )}
              </div>
              <div className={mL}>
                {user.info.blocking && (
                  <button
                    onClick={() => {
                      handleBlock(user.id);
                    }}
                    className={button}
                  >
                    Unblock
                  </button>
                )}
                {!user.info.blocking && (
                  <button
                    onClick={() => {
                      handleBlock(user.id);
                    }}
                    className={button}
                  >
                    Block
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div>
      <h3>Blocked Users</h3>
      <div className={card}>
        <div className={cardBody}>
          <div className={tbRowM + " " + mB1}>
            <div className={tbCol12}>
              <div className={formGroup}>
                <input
                  placeholder="Search for user..."
                  onChange={filterUsers}
                  className={input}
                />
              </div>
            </div>
          </div>
          {blockedUsers}
          {!blockedUsers.length && !manager.loading && !manager.error && (
            <div className={alert}>
              <SmileIcon width="18" />
              There are no users here.
            </div>
          )}
          {
            manager.error &&
            <div className={alert}>
              <FrownIcon width="18" />
              There was an error.
            </div>
          }
          {
            manager.loading &&
            <div className={alert}>
              <LoadingGraphic width={20}/>
              Loading...
            </div>
          }
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = state => {
  const { auth } = state;
  return { auth: auth };
};

export default connect(mapStateToProps)(Blocked);
