// @flow

import React, {useState, useEffect, useRef} from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PerfectScrollbar from 'perfect-scrollbar';
import 'perfect-scrollbar/css/perfect-scrollbar.css';
import axios from "axios";

import {
  flex,
  justifyContentCenter,
  mT1,
  mL1,
  mB1,
  grey,
  tbRowN,
  tbCol6,
  flexColumn
} from "../../../../../../../css/layout.css";
import formStyles from "../../../../../../../css/form.css";
import sidebarStyles from "../../../../../../../css/layout/social/nav/sidebar.css";
import rightSidebarStyles from "../../../../../../../css/layout/social/nav/right.css";
import { username, bio } from "../../../../../../../css/components/pp.css";
import { tag } from "../../../../../../../css/components/tag.css";

import FrownIcon from "../../../../../../../assets/svg/icons/frown.svg";

import ProfilePicture from "../../../user/ProfilePicture";

import {API_URL} from "../../../../../../../util/constants";

function RecommendNav(props) {

  const containerRef = useRef();
  const scrollRef = useRef();
    const _isMounted = useRef(true);

  const [manager, setManager] = useState({
      usersError: false,
      users: [],
      interesting: [],
      trending: [],
      loading: {
          users: true,
          interesting: true,
          trending: true,
      }
  });

    useEffect(() => {
        return () => {
            _isMounted.current = false
        }
    }, []);

  useEffect(() => {
    scrollRef.current = new PerfectScrollbar(containerRef.current, {
      suppressScrollX: true
    });
  }, []);

  useEffect(() => {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    axios.get(API_URL + `/social/recommend/users`, config)
        .then(function (res) {
          if(res.data.data.users && _isMounted.current){
            setManager(manager => ({
                ...manager,
                users: res.data.data.users,
                loading: {
                    ...manager.loading,
                    users: false,
                }
            }))
          }
        })
        .catch(function (err) {

        });
  }, []);

  useEffect(() => {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    axios.get(API_URL + `/social/recommend/tags/interesting`, config)
        .then(function (res) {
          if(res.data.data.tags && _isMounted.current){
            setManager(manager => ({
                ...manager,
                interesting: res.data.data.tags,
                loading: {
                    ...manager.loading,
                    interesting: false,
                }
            }))
          }
        })
        .catch(function (err) {

        });
  }, []);

  useEffect(() => {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    axios.get(API_URL + `/social/recommend/tags/trending`, config)
        .then(function (res) {
          if(res.data.data.tags && _isMounted.current){
            setManager(manager => ({
                ...manager,
                trending: res.data.data.tags,
                loading: {
                    ...manager.loading,
                    trending: false,
                }
            }))
          }
        })
        .catch(function (err) {

        });
  }, []);

  let recommend = [];
  manager.users.forEach((user, index) => {
    recommend.push(
        <div className={index !== 0 ? flex + " " + mT1 : flex} key={index}>
          <div>
            <ProfilePicture user={user} />
          </div>
          <div
              className={
                mL1 + " " + flex + " " + flexColumn + " " + justifyContentCenter
              }
          >
            <h4 className={username}>{user.info.username}</h4>
            {
              user.info.biography &&
              <label className={bio}>{user.info.biography}</label>
            }
            {
              user.info.biography === null && user.info.follower_count &&
              <label className={bio}>{user.info.follower_count} followers</label>
            }
          </div>
        </div>
    );
  });


  let iTagRows = [];
  let interestingTags = JSON.parse(JSON.stringify(manager.interesting));
  while (interestingTags.length) {
    iTagRows.push(interestingTags.splice(0, 2));
  }

  let tTagRows = [];
  let trendingTags = JSON.parse(JSON.stringify(manager.trending));
  while (trendingTags.length) {
    tTagRows.push(trendingTags.splice(0, 2));
  }

  let interesting = [];
  iTagRows.forEach((group, index) => {
    interesting.push(
        React.createElement(
            "div",
            { className: index !== 0 ? tbRowN + " " + mT1 : tbRowN, key: index },
            group.map((obj, index) => (
                <div
                    key={obj.title + "_" + index}
                    className={tbCol6 + " " + flex + " " + flexColumn + " " + tag}
                >
                  <Link to={`/search/${obj.title}`}>#{obj.title}</Link>
                  <label>{obj.count} posts</label>
                </div>
            ))
        )
    );
  });

  let trending = [];
  tTagRows.forEach((group, index) => {
    trending.push(
        React.createElement(
            "div",
            { className: index !== 0 ? tbRowN + " " + mT1 : tbRowN, key: index },
            group.map((obj, index) => (
                <div
                    key={obj.title + "_" + index}
                    className={tbCol6 + " " + flex + " " + flexColumn + " " + tag}
                >
                  <Link to={`/search/${obj.title}`}>#{obj.title}</Link>
                  <label>{obj.count} posts</label>
                </div>
            ))
        )
    );
  });

  return (
      <div className={sidebarStyles.sidebarContainer + ' ' + rightSidebarStyles.sidebarContainer}>
        <div className={sidebarStyles.sidebar + ' ' + rightSidebarStyles.sidebar} ref={containerRef}>
          <div className={mB1}>
            <div className={sidebarStyles.sidebarItem + " " + sidebarStyles.sidebarTitle}>
              <label>DISCOVER PEOPLE</label>
            </div>
            <div className={sidebarStyles.sidebarObject}>
              <div className={grey}>
                  {recommend}
                  {
                      recommend.length === 0 && !manager.loading.users &&
                      <div className={formStyles.alert}>
                          <FrownIcon width="18" />
                          There are no users here.
                      </div>
                  }
              </div>
            </div>
            <div className={sidebarStyles.sidebarItem + " " + sidebarStyles.sidebarTitle}>
              <label>INTERESTING TAGS</label>
            </div>
            <div className={sidebarStyles.sidebarObject}>
              <div className={grey}>
                  {interesting}
                  {
                      interesting.length === 0 && !manager.loading.interesting &&
                      <div className={formStyles.alert}>
                          <FrownIcon width="18" />
                          There are no tags here.
                      </div>
                  }
              </div>
            </div>
            <div className={sidebarStyles.sidebarItem + " " + sidebarStyles.sidebarTitle}>
              <label>TRENDING TAGS</label>
            </div>
            <div className={sidebarStyles.sidebarObject + ' ' + mB1}>
              <div className={grey}>
                  {trending}
                  {
                      trending.length === 0 && !manager.loading.trending &&
                      <div className={formStyles.alert}>
                          <FrownIcon width="18" />
                          There are no tags here.
                      </div>
                  }
              </div>
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

export default connect(mapStateToProps)(RecommendNav);
