// @flow

import React, {useState, useEffect} from "react";
import { connect } from "react-redux";
import axios from "axios";

import {
  card,
  cardBody
} from "../../../../css/layout/social/settings/card.css";
import formStyles, {formGroup} from "../../../../css/form.css";
import layoutStyles, {mL, mB1, flex, mT1} from "../../../../css/layout.css";
import { withGap } from "../../../../css/components/radio.css";
import { lever, switchInput } from "../../../../css/components/switch.css";

import LoadingGraphic from "../../../../assets/loading/dots.svg"
import FrownIcon from "../../../../assets/svg/icons/frown.svg";
import CircleLoading from "../../../../assets/loading/circle-loading.svg";

import {API_URL, VIEW_EVERYONE, VIEW_FOLLOWERS, VIEW_FORMERLY_CHUCKS} from "../../../../util/constants";

function Privacy(props) {

  const [manager, setManager] = useState({
    privacy: [],
    loading: true,
    error: false,
    updated: false,
    view: {
      saving: false,
      edit: false,
    },
    content: {
      saving: false,
      edit: false,
    },
    action: {
      saving: false,
      edit: false,
    },
    tiblar: {
      saving: false,
      edit: false,
    },
  });

  useEffect(() => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      }
    };

    axios.get(API_URL + "/users/@me/privacy", config).then(res => {
      if(res.data.data.privacy){
        setManager(manager => ({
          ...manager,
          privacy: res.data.data.privacy,
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

  function handleChange(type, setting, value) {
    setManager(manager => ({
      ...manager,
      privacy: {
        ...manager.privacy,
        [setting]: value,
      },
      [type]: {
        ...manager[type],
        edit: true,
      }
    }))
  }

  function saveSettings(type, url, json) {
    if(type !== null && manager[type].saving){
      return;
    }

    setManager({
      ...manager,
      [type]: {
        ...manager[type],
        saving: true,
      }
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
      }
    };

    axios
        .patch(API_URL + "/users/@me/settings/privacy/" + url, json, config)
        .then(res => {
          setTimeout(() => {
            if(res.data.data.privacy){
              setManager({
                ...manager,
                [type]: {
                  edit: false,
                  saving: false,
                }
              });

              return;
            }

            setManager(manager => ({
              ...manager,
              error: true,
              loading: false,
            }));
          }, 200)
        })
        .catch(err => {
          setManager(manager => ({
            ...manager,
            error: true,
            loading: false,
          }));
        });
  }

  return (
      <div>
        <h3>Privacy</h3>
        <div className={card}>
          {
            manager.loading &&
            <div className={layoutStyles.flex + ' ' + layoutStyles.justifyContentCenter}>
              <LoadingGraphic width={100} />
            </div>
          }
          {
            !manager.loading && !manager.error &&
            <div className={cardBody}>
              <div className={formGroup}>
                <label>Allow profile to be viewed by:</label>
                <label>
                  <input name="view"
                         checked={manager.privacy.view === VIEW_EVERYONE}
                         onChange={() => {handleChange("view", "view", VIEW_EVERYONE)}}
                         className={withGap}
                         type="radio" />
                  <span>Any Visitor</span>
                </label>
                <label>
                  <input name="view"
                         checked={manager.privacy.view === VIEW_FORMERLY_CHUCKS}
                         onChange={() => {handleChange("view", "view", VIEW_FORMERLY_CHUCKS)}}
                         className={withGap}
                         type="radio" />
                  <span>Formerly Chuck's Users</span>
                </label>
                <label>
                  <input name="view"
                         checked={manager.privacy.view === VIEW_FOLLOWERS}
                         onChange={() => {handleChange("view", "view", VIEW_FOLLOWERS)}}
                         className={withGap}
                         type="radio" />
                  <span>My Followers</span>
                </label>
                {
                  manager.view.edit &&
                  <div>
                    <button
                        onClick={() => {
                          saveSettings("view", "view", {view: manager.privacy.view})
                        }}
                        style={{minHeight: "34px"}}
                        className={formStyles.button + ' ' + formStyles.buttonPrimary + ' ' + formStyles.buttonIcon + ' ' + mT1}>
                      {
                        !manager.view.saving && "Save"
                      }
                      {
                        manager.view.saving && <CircleLoading width={16} />
                      }
                    </button>
                  </div>
                }
              </div>
              <hr />
              <div className={formGroup}>
                <label>Allow people to see your:</label>
                <div className={flex + " " + mB1}>
                  <p>Your likes</p>
                  <div className={mL}>
                    <div className={switchInput}>
                      <label>
                        <input type="checkbox"
                               onChange={() => {handleChange("content", "likes", !manager.privacy.likes)}}
                               checked={manager.privacy.likes}/>
                        <span className={lever}/>
                      </label>
                    </div>
                  </div>
                </div>
                <div className={flex + " " + mB1}>
                  <p>Your following</p>
                  <div className={mL}>
                    <div className={switchInput}>
                      <label>
                        <input type="checkbox"
                               onChange={() => {handleChange("content", "following", !manager.privacy.following)}}
                               checked={manager.privacy.following}/>
                        <span className={lever}/>
                      </label>
                    </div>
                  </div>
                </div>
                <div className={flex}>
                  <p>Follower count</p>
                  <div className={mL}>
                    <div className={switchInput}>
                      <label>
                        <input type="checkbox"
                               onChange={() => {handleChange("content", "follower_count", !manager.privacy.follower_count)}}
                               checked={manager.privacy.follower_count}/>
                        <span className={lever}/>
                      </label>
                    </div>
                  </div>
                </div>
                {
                  manager.content.edit &&
                  <div>
                    <button
                        onClick={() => {
                          saveSettings(
                              "content",
                              "content",
                              {
                                likes: manager.privacy.likes,
                                following: manager.privacy.following,
                                follower_count: manager.privacy.follower_count
                              }
                          )
                        }}
                        style={{minHeight: "34px"}}
                        className={formStyles.button + ' ' + formStyles.buttonPrimary + ' ' + formStyles.buttonIcon + ' ' + mT1}>
                      {
                        !manager.content.saving && "Save"
                      }
                      {
                        manager.content.saving && <CircleLoading width={16} />
                      }
                    </button>
                  </div>
                }
              </div>
              <hr />
              <div className={formGroup}>
                <label>Allow people to:</label>
                <div className={flex + " " + mB1}>
                  <p>Ask questions</p>
                  <div className={mL}>
                    <div className={switchInput}>
                      <label>
                        <input type="checkbox"
                               onChange={() => {handleChange("action", "asks", !manager.privacy.asks)}}
                               checked={manager.privacy.asks}/>
                        <span className={lever}/>
                      </label>
                    </div>
                  </div>
                </div>
                <div className={flex + " " + mB1}>
                  <p>Reply to your posts</p>
                  <div className={mL}>
                    <div className={switchInput}>
                      <label>
                        <input type="checkbox"
                               onChange={() => {handleChange("action", "reply", !manager.privacy.reply)}}
                               checked={manager.privacy.reply}/>
                        <span className={lever}/>
                      </label>
                    </div>
                  </div>
                </div>
                <div className={flex}>
                  <p>Send you messages</p>
                  <div className={mL}>
                    <div className={switchInput}>
                      <label>
                        <input type="checkbox"
                               onChange={() => {handleChange("action", "message", !manager.privacy.message)}}
                               checked={manager.privacy.message}/>
                        <span className={lever}/>
                      </label>
                    </div>
                  </div>
                </div>
                {
                  manager.action.edit &&
                  <div>
                    <button
                        onClick={() => {
                          saveSettings(
                              "action",
                              "action",
                              {
                                asks: manager.privacy.asks,
                                reply: manager.privacy.reply,
                                message: manager.privacy.message
                              }
                          )
                        }}
                        style={{minHeight: "34px"}}
                        className={formStyles.button + ' ' + formStyles.buttonPrimary + ' ' + formStyles.buttonIcon + ' ' + mT1}>
                      {
                        !manager.action.saving && "Save"
                      }
                      {
                        manager.action.saving && <CircleLoading width={16} />
                      }
                    </button>
                  </div>
                }
              </div>
              <hr />
              <div className={formGroup}>
                <label>Allow Formerly Chuck's to:</label>
                <div className={flex}>
                  <p>Personalize recommendations</p>
                  <div className={mL}>
                    <div className={switchInput}>
                      <label>
                        <input type="checkbox"
                               onChange={() => {handleChange("tiblar", "recommend", !manager.privacy.recommend)}}
                               checked={manager.privacy.recommend}/>
                        <span className={lever}/>
                      </label>
                    </div>
                  </div>
                </div>
                {
                  manager.tiblar.edit &&
                  <div>
                    <button
                        onClick={() => {
                          saveSettings(
                              "Formerly Chuck's",
                              "formerly-chucks",
                              {
                                recommend: manager.privacy.recommend,
                              }
                          )
                        }}
                        style={{minHeight: "34px"}}
                        className={formStyles.button + ' ' + formStyles.buttonPrimary + ' ' + formStyles.buttonIcon + ' ' + mT1}>
                      {
                        !manager.tiblar.saving && "Save"
                      }
                      {
                        manager.tiblar.saving && <CircleLoading width={16} />
                      }
                    </button>
                  </div>
                }
              </div>
            </div>
          }
          {
            manager.error &&
            <div className={cardBody}>
              <div className={formStyles.alert}>
                <FrownIcon width="18" />
                There was an error.
              </div>
            </div>
          }
        </div>
      </div>
  );
}

const mapStateToProps = state => {
  const { auth } = state;
  return { auth: auth };
};

export default connect(mapStateToProps)(Privacy);
