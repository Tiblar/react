// @flow

import React, {useEffect, useRef, useState} from "react";
import { connect } from "react-redux";
import axios from "axios";
import {toast} from "react-toastify";
import "croppie/croppie.css";
import Pickr from '@simonwep/pickr';
import '@simonwep/pickr/dist/themes/nano.min.css';
import {isMobile} from "is-mobile";

import {
  card,
  cardBody,
  cardFooter,
  cardImage,
  cardSelector,
  active
} from "../../../../css/layout/social/settings/card.css";
import formStyles, { image, formGroup, input } from "../../../../css/form.css";
import layoutStyles, {
  mL1,
  mT1,
  mB1,
  mN,
  mL,
  wF,
  tbRowM,
  tbCol3,
  tbCol4,
  tbCol6,
  tbCol9,
  tbCol12,
  flex,
  flexColumn,
  flexRow,
  hide
} from "../../../../css/layout.css";
import modalStyles from "../../../../css/components/modal.css";
import {lever, switchInput} from "../../../../css/components/switch.css";

import EnglishFlag from "../../../../assets/svg/flags/united-states.svg";
import CircleLoading from "../../../../assets/loading/circle-loading.svg";

import CozyImage from "../../../../assets/graphics/social/themes/cozy.jpg";
import CloverImage from "../../../../assets/graphics/social/themes/clover.jpg";
import OutrunImage from "../../../../assets/graphics/social/themes/outrun.jpg";
import CyberpunkImage from "../../../../assets/graphics/social/themes/cyberpunk.jpg";
import NewspaperImage from "../../../../assets/graphics/social/themes/newspaper.jpg";
import SkeletonImage from "../../../../assets/graphics/social/themes/skeleton.jpg";

import store from "../../../../store";
import {API_URL, MAX_BIOGRAPHY_LENGTH, MAX_LOCATION_LENGTH, MAX_MOBILE_WIDTH} from "../../../../util/constants";
import {loadUser} from "../../../../reducers/auth/actions";
import {toBase64, urlToFile} from "../../../../util/fileMutator";
import {reset} from "../../../../reducers/social/actions";
import {updateTheme} from "../../../../reducers/theme/actions";
import {DARK_THEME, LIGHT_THEME} from "../../../../reducers/theme/constants";
import ContentLoader from "../../../../util/components/ContentLoader";
import useWindowDimensions from "../../../../util/hooks/useWindowDimensions";
import {LAYER, useLayerDispatch} from "../../layout/layer/context";
import Upgrade from "./Upgrade";

function Appearance(props) {
  const {width} = useWindowDimensions();
  const dispatchLayer = useLayerDispatch();

  const [manager, setManager] = useState({
    loading: {
      avatar: true,
    },
    info: {
      avatar: getInfo('avatar'),
      biography: getInfo('biography'),
      location: getInfo('location'),
      theme: props.auth.user !== null ? props.auth.user.theme : null,
      nsfw: getInfo('nsfw'),
      nsfwFilter: props.auth.user !== null ? !props.auth.user.nsfw_filter : null,
      profileTheme: getInfo('profile_theme'),
      usernameColor: getInfo('username_color')
    },
    avatarModal: false,
    avatarBase64: null,
    savingAvatar: false,
    savingBiography: false,
    savingLocation: false,
    croppie: null,
  });

  const avatarRef = useRef();

  useEffect(() => {
    setManager({
      ...manager,
      info: {
        ...manager.info,
        avatar: getInfo('avatar'),
        biography: getInfo('biography'),
        location: getInfo('location'),
        theme: props.auth.user !== null ? props.auth.user.theme : null,
        nsfw: getInfo('nsfw'),
        nsfwFilter: props.auth.user !== null ? !props.auth.user.nsfw_filter : null,
        profileTheme: getInfo('profile_theme')
      },
    });
  }, [props.auth.user]);

  useEffect(() => {
    async function load() {
      if(manager.avatarBase64 !== null && manager.croppie === null){
        const Croppie = (await import("croppie")).default;

        let croppie = new Croppie(document.getElementById('croppie'), {
          viewport: { width: 128, height: 128 },
          boundary: { width: 300, height: 300 },
          size: {height: 610, width: 200},
          enforceBoundary: true,
        });

        setManager({
          ...manager,
          croppie: croppie,
        });
      }
    }

    load();
  }, [manager.avatarBase64]);

  useEffect(() => {
    if(!props.auth.user.boosted){
      return;
    }

    let pickr = new Pickr({
      el: '#pickr',
      theme: 'nano',
      container: '#appearance',
      default: manager.info.usernameColor ? manager.info.usernameColor : "#6c757d",
      lockOpacity: false,
      autoReposition: false,
      components: {
        preview: true,
        opacity: false,
        hue: true,
        interaction: {
          input: true,
          clear: true,
          save: true
        }
      }
    });

    pickr.on('save', (color) => {
      if(color){
        handleColor(color.toHEXA().toString())
      }else{
        handleColor(null)
      }
    })
  }, []);

  const ProfileLoader = (props) => (
      <ContentLoader
          width="100%"
          height={110}
          viewBox="0 0 110 110"
      >
        <rect x="0" y="0" rx="15" ry="15" width="110" height="110" />
      </ContentLoader>
  )

  const ProfileThemeButton = (props) => (
      <button className={formStyles.button + ' ' + wF + ' ' + (getInfo('profile_theme') === props.theme ? formStyles.buttonPrimary : '' )}
              onClick={() => { handleProfileTheme(props.theme) }}>
        {
          getInfo('profile_theme') === props.theme && "Deactivate"
        }
        {
          getInfo('profile_theme') !== props.theme && "Activate"
        }
      </button>
  )

  function getInfo(key) {
    if(props.auth.user !== null){
      return props.auth.user.info[key];
    }

    return null;
  }

  async function handleAvatar() {
    let files = avatarRef.current.files;

    if(files.length === 0){
      return;
    }

    let base64 = await toBase64(files[0]);

    setManager({
      ...manager,
      avatarModal: true,
      avatarBase64: base64,
    });
  }

  function closeAvatar() {
    if(manager.savingAvatar){
      return;
    }

    manager.croppie.destroy();

    setManager({
      ...manager,
      avatarModal: false,
      croppie: null,
    });
  }

  async function saveAvatar() {
    if(manager.savingAvatar){
      return;
    }

    setManager({ ...manager, savingAvatar: true });

    let image = await manager.croppie.result('canvas');
    let file = await urlToFile(image, 'avatar.png', 'image/png')

    const config = {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    };

    const data = new FormData();

    data.append('file', file);

    axios
        .post(API_URL + "/users/@me/settings/avatar", data, config)
        .then(res => {
          store.dispatch(loadUser());
          store.dispatch(reset());

          const Notification = () => (
              <div>
                Your avatar has been saved!
              </div>
          );

          toast(<Notification />, {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

          setManager({ ...manager, savingAvatar: false, avatarModal: false });
        })
        .catch(err => {
          setManager({ ...manager, savingAvatar: false });

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

  function handleBiography(e) {
    setManager({
      ...manager,
      info: {
        ...manager.info,
        biography: e.target.value
      }
    });
  }

  function saveSettings(saving, type, url, json, customError = "There was an error") {
    if(saving !== null && manager[saving]){
      return;
    }

    setManager({ ...manager, [saving]: true });

    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    axios
        .patch(API_URL + "/users/@me/settings/" + url, json, config)
        .then(res => {
          store.dispatch(loadUser());

          const Notification = () => (
              <div>
                Your {type} has been saved!
              </div>
          );

          setTimeout(() => {

            toast(<Notification />, {
              position: "bottom-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }, 300);

          if(saving !== null){
            setManager({ ...manager, [saving]: false });
          }
        })
        .catch(err => {
          if(saving !== null){
            setManager({ ...manager, [saving]: false });
          }

          const Notification = () => (
              <div>
                {customError}
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

  function handleLocation(e) {
    setManager({
      ...manager,
      info: {
        ...manager.info,
        location: e.target.value
      }
    });
  }

  function handleTheme(theme) {
    setManager({
      ...manager,
      info: {
        ...manager.info,
        theme: theme
      }
    });

    store.dispatch(updateTheme(theme));

    saveSettings(null, 'theme', 'theme', { theme: theme });
  }

  function handleNsfw() {
    setManager({
      ...manager,
      info: {
        ...manager.info,
        nsfw: !manager.info.nsfw
      }
    });

    saveSettings(null, 'nsfw marking', 'nsfw', { nsfw: !manager.info.nsfw });
  }

  function handleNsfwFilter() {
    setManager({
      ...manager,
      info: {
        ...manager.info,
        nsfwFilter: manager.info.nsfwFilter
      }
    });

    saveSettings(null, 'nsfw filter', 'nsfw-filter', { nsfw_filter: manager.info.nsfwFilter });
  }

  function handleColor(color) {
    saveSettings(null, 'color', 'username-color', { hex_color: color }, "Choose another color :(");
  }

  function handleProfileTheme(theme) {
    if(theme === getInfo('profile_theme')){
      theme = null;
    }

    setManager({
      ...manager,
      info: {
        ...manager.info,
        profileTheme: theme
      }
    });

    saveSettings(null, 'profile theme', 'profile-theme', { profile_theme: theme });
  }

  function handleUpgrade() {
    dispatchLayer({ type: LAYER, payload: <Upgrade /> });
  }

  return (
      <div>
        {
          manager.avatarModal &&
          <div className={modalStyles.containerOuter + (isMobile() ? (" " + modalStyles.mobile) : "")}>
            <div className={modalStyles.wrapper}>
              <div className={modalStyles.containerInner}>
                <div className={modalStyles.modalContainer}>
                  <div className={modalStyles.modal}>
                    <div className={modalStyles.top}>
                      <div className={modalStyles.header}>
                        <h3>New Avatar</h3>
                      </div>
                    </div>
                    <div className={modalStyles.body}>
                      <img
                          alt="croppie"
                          id="croppie"
                          src={manager.avatarBase64} />
                    </div>
                    <div className={modalStyles.footer}>
                      <button className={formStyles.button} disabled={manager.savingAvatar} onClick={closeAvatar}>Close</button>
                      <button className={formStyles.button + ' ' + formStyles.buttonPrimary + ' ' + formStyles.buttonIcon + ' ' + mL} onClick={saveAvatar}>
                        {
                          !manager.savingAvatar && "Save"
                        }
                        {
                          manager.savingAvatar && <CircleLoading width={16} />
                        }
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
        <h3>Appearance</h3>
        <div className={card}>
          <div className={cardBody}>
            {
              width > MAX_MOBILE_WIDTH &&
              <div className={tbRowM + " " + mB1}>
                <div className={tbCol3}>
                  <div>
                    <div className={image}>
                      {
                        props.auth.user !== null &&
                        <img
                            onLoad={() => { setManager(manager => ({ ...manager, loading: { ...manager.loading, avatar: false } })) }}
                            className={wF + ' ' + (manager.loading.avatar ? hide : '')}
                            alt="profile"
                            src={manager.info.avatar}
                        />
                      }
                      {
                        manager.loading.avatar && <ProfileLoader />
                      }
                    </div>
                    <input
                        type="file"
                        accept=".png,.jpeg,.jpg"
                        onChange={handleAvatar}
                        ref={avatarRef}
                        className={hide}/>
                    <button onClick={() => { avatarRef.current.click() }} className={formStyles.button + " " + mT1 + " " + wF}>
                      Change
                    </button>
                  </div>
                </div>
                <div className={tbCol9}>
                  <div>
                    <h4 className={mN}>
                      About Section
                    </h4>
                    <div className={formGroup}>
                  <textarea
                      className={input}
                      value={manager.info.biography === null ? "" : manager.info.biography}
                      onChange={handleBiography}
                      maxLength={MAX_BIOGRAPHY_LENGTH}
                      placeholder="You can put whatever you want in here!" />
                      {
                        manager.info.biography !== getInfo('biography') &&
                        <div>
                          <button
                              onClick={() => {
                                saveSettings('savingBiography', 'biography', 'biography', { biography: manager.info.biography })
                              }}
                              style={{minHeight: "34px"}}
                              className={formStyles.button + ' ' + formStyles.buttonPrimary + ' ' + formStyles.buttonIcon + ' ' + mT1}>
                            {
                              !manager.savingBiography && "Save"
                            }
                            {
                              manager.savingBiography && <CircleLoading width={16} />
                            }
                          </button>
                        </div>
                      }
                    </div>
                    <h4 className={mN}>Location</h4>
                    <div className={formGroup}>
                      <input
                          className={input}
                          value={manager.info.location === null ? "" : manager.info.location}
                          onChange={handleLocation}
                          maxLength={MAX_LOCATION_LENGTH}
                          placeholder="e.g. Bethesda, Maryland"
                      />
                      {
                        manager.info.location !== getInfo('location') &&
                        <div>
                          <button
                              onClick={() => {
                                saveSettings('savingLocation', 'location', 'location', { location: manager.info.location })
                              }}
                              style={{minHeight: "34px"}}
                              className={formStyles.button + ' ' + formStyles.buttonPrimary + ' ' + formStyles.buttonIcon + ' ' + mT1}>
                            {
                              !manager.savingLocation && "Save"
                            }
                            {
                              manager.savingLocation && <CircleLoading width={16} />
                            }
                          </button>
                        </div>
                      }
                    </div>
                  </div>
                </div>
              </div>
            }
            {
              width <= MAX_MOBILE_WIDTH &&
              <div className={tbRowM + " " + mB1}>
                <div className={tbCol6}>
                  <div>
                    <div className={image}>
                      {
                        props.auth.user !== null &&
                        <img
                            onLoad={() => { setManager(manager => ({ ...manager, loading: { ...manager.loading, avatar: false } })) }}
                            className={wF + ' ' + (manager.loading.avatar ? hide : '')}
                            alt="profile"
                            src={manager.info.avatar}
                        />
                      }
                      {
                        manager.loading.avatar && <ProfileLoader />
                      }
                    </div>
                    <input
                        type="file"
                        accept=".png,.jpeg,.jpg"
                        onChange={handleAvatar}
                        ref={avatarRef}
                        className={hide}/>
                    <button onClick={() => { avatarRef.current.click() }} className={formStyles.button + " " + mT1 + " " + wF}>
                      Change
                    </button>
                  </div>
                </div>
              </div>
            }
            {
              width <= MAX_MOBILE_WIDTH &&
              <div className={tbRowM + " " + mB1}>
                <div className={tbCol12}>
                  <div>
                    <h4 className={mN}>
                      About Section
                    </h4>
                    <div className={formGroup}>
                  <textarea
                      className={input}
                      value={manager.info.biography === null ? "" : manager.info.biography}
                      onChange={handleBiography}
                      maxLength={MAX_BIOGRAPHY_LENGTH}
                      placeholder="You can put whatever you want in here!" />
                      {
                        manager.info.biography !== getInfo('biography') &&
                        <div>
                          <button
                              onClick={() => {
                                saveSettings('savingBiography', 'biography', 'biography', { biography: manager.info.biography })
                              }}
                              style={{minHeight: "34px"}}
                              className={formStyles.button + ' ' + formStyles.buttonPrimary + ' ' + formStyles.buttonIcon + ' ' + mT1}>
                            {
                              !manager.savingBiography && "Save"
                            }
                            {
                              manager.savingBiography && <CircleLoading width={16} />
                            }
                          </button>
                        </div>
                      }
                    </div>
                    <h4 className={mN}>Location</h4>
                    <div className={formGroup}>
                      <input
                          className={input}
                          value={manager.info.location === null ? "" : manager.info.location}
                          onChange={handleLocation}
                          maxLength={MAX_LOCATION_LENGTH}
                          placeholder="e.g. Bethesda, Maryland"
                      />
                      {
                        manager.info.location !== getInfo('location') &&
                        <div>
                          <button
                              onClick={() => {
                                saveSettings('savingLocation', 'location', 'location', { location: manager.info.location })
                              }}
                              style={{minHeight: "34px"}}
                              className={formStyles.button + ' ' + formStyles.buttonPrimary + ' ' + formStyles.buttonIcon + ' ' + mT1}>
                            {
                              !manager.savingLocation && "Save"
                            }
                            {
                              manager.savingLocation && <CircleLoading width={16} />
                            }
                          </button>
                        </div>
                      }
                    </div>
                  </div>
                </div>
              </div>
            }
            <hr />
            <div className={tbRowM + " " + mB1 + " " + mT1}>
              <div className={tbCol12}>
                <h4 className={mN}>Display Color</h4>
                <div className={formGroup + " " + flexRow}>
                  <div
                      onClick={() => { handleTheme(LIGHT_THEME) }}
                      className={cardSelector + " " + (manager.info.theme === LIGHT_THEME ? active : '')}>
                    <div
                        style={{
                          height: 30,
                          width: 30,
                          border: "1px solid #ebf0f0",
                          borderRadius: ".2em",
                          background: "#ffffff"
                        }}
                    />
                    <p>Light</p>
                  </div>
                  <div
                      onClick={() => { handleTheme(DARK_THEME) }}
                      className={cardSelector + " " + mL1 + " " + (manager.info.theme === DARK_THEME ? active : '')}>
                    <div
                        style={{
                          height: 30,
                          width: 30,
                          border: "1px solid #ebf0f0",
                          borderRadius: ".2em",
                          background: "#3C3C3C"
                        }}
                    />
                    <p>Dark</p>
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div className={tbRowM + " " + mB1 + " " + mT1}>
              <div className={tbCol12}>
                <h4 className={mN}>NSFW Content</h4>
                <div className={flexRow + " " + (width > MAX_MOBILE_WIDTH ? formGroup : mT1)}>
                  <div className={card}>
                    <div className={cardBody}>
                      <div className={switchInput}>
                        <label>
                          <input checked={props.auth.user !== null ? !props.auth.user.nsfw_filter : false} onChange={handleNsfwFilter} value={manager.info.nsfwFilter} type="checkbox"/>{" "}
                          <span className={lever} />
                          Show NSFW
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className={card + " " + (width > MAX_MOBILE_WIDTH ? mL1 : mT1)}>
                    <div className={cardBody}>
                      <div className={switchInput}>
                        <label>
                          <input checked={getInfo('nsfw')} onChange={handleNsfw} value={manager.info.nsfw} type="checkbox"/>{" "}
                          <span className={lever} />
                          Mark account as NSFW
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div className={tbRowM + " " + mB1 + " " + mT1}>
              <div className={tbCol12}>
                <h4 className={mN}>Language Selector</h4>
                <div className={flexRow + " " + formGroup}>
                  <div className={cardSelector + " " + active}>
                    <EnglishFlag height="30" />
                    <p>English</p>
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div className={tbRowM + " " + mB1 + " " + mT1}>
              <div className={tbCol12}>
                <h4 className={mN}>Username Color</h4>
              </div>
            </div>
            {
              props.auth.user.boosted &&
              <div className={tbRowM + " " + mB1} id="appearance">
                <div className={tbCol12}>
                  <div id="pickr" />
                </div>
              </div>
            }
            {
              props.auth.user.boosted &&
              <hr />
            }
            {
              !props.auth.user.boosted &&
              <div className={formStyles.alert}>
                Get boost to change the color!
                <button className={formStyles.button + ' ' + formStyles.buttonPrimary
                                  + ' ' + formStyles.buttonSmall + ' ' + layoutStyles.mL}
                        onClick={handleUpgrade}>
                  Upgrade
                </button>
              </div>
            }
            <div className={tbRowM + " " + mB1 + " " + mT1}>
              <div className={tbCol12}>
                <h4 className={mN}>Profile Themes</h4>
              </div>
            </div>
            {
              width > MAX_MOBILE_WIDTH &&
              <div className={tbRowM + " " + mB1}>
                <div className={tbCol4}>
                  <div className={card}>
                    <div className={cardImage}>
                      <img alt="clover" className={wF} src={CloverImage} />
                    </div>
                    <div className={cardFooter + " " + flexColumn}>
                      <p>Clover</p>
                      <hr />
                      <ProfileThemeButton theme="clover" />
                    </div>
                  </div>
                </div>
                <div className={tbCol4}>
                  <div className={card}>
                    <div className={cardImage}>
                      <img alt="cozy" className={wF} src={CozyImage} />
                    </div>
                    <div className={cardFooter + " " + flexColumn}>
                      <p>Cozy</p>
                      <hr />
                      <ProfileThemeButton theme="cozy" />
                    </div>
                  </div>
                </div>
                <div className={tbCol4}>
                  <div className={card}>
                    <div className={cardImage}>
                      <img alt="outrun" className={wF} src={OutrunImage} />
                    </div>
                    <div className={cardFooter + " " + flexColumn}>
                      <p>Outrun</p>
                      <hr />
                      <ProfileThemeButton theme="outrun" />
                    </div>
                  </div>
                </div>
              </div>
            }
            {
              width > MAX_MOBILE_WIDTH &&
              <div className={tbRowM + " " + mB1}>
                <div className={tbCol4}>
                  <div className={card}>
                    <div className={cardImage}>
                      <img alt="cyberpunk" className={wF} src={CyberpunkImage} />
                    </div>
                    <div className={cardFooter + " " + flexColumn}>
                      <p>Cyberpunk</p>
                      <hr />
                      <ProfileThemeButton theme="cyberpunk" />
                    </div>
                  </div>
                </div>
                <div className={tbCol4}>
                  <div className={card}>
                    <div className={cardImage}>
                      <img alt="newspaper" className={wF} src={NewspaperImage} />
                    </div>
                    <div className={cardFooter + " " + flexColumn}>
                      <p>Newspaper</p>
                      <hr />
                      <ProfileThemeButton theme="newspaper" />
                    </div>
                  </div>
                </div>
                <div className={tbCol4}>
                  <div className={card}>
                    <div className={cardImage}>
                      <img alt="skeleton" className={wF} src={SkeletonImage} />
                    </div>
                    <div className={cardFooter + " " + flexColumn}>
                      <p>Skeleton</p>
                      <hr />
                      <ProfileThemeButton theme="skeleton" />
                    </div>
                  </div>
                </div>
              </div>
            }
            {
              width <= MAX_MOBILE_WIDTH &&
              <div className={mT1}>
                <div className={card}>
                  <div className={cardImage}>
                    <img alt="clover" className={wF} src={CloverImage} />
                  </div>
                  <div className={cardFooter + " " + flexColumn}>
                    <p>Clover</p>
                    <hr />
                    <ProfileThemeButton theme="clover" />
                  </div>
                </div>
                <div className={card + ' ' + mT1}>
                  <div className={cardImage}>
                    <img alt="cozy" className={wF} src={CozyImage} />
                  </div>
                  <div className={cardFooter + " " + flexColumn}>
                    <p>Cozy</p>
                    <hr />
                    <ProfileThemeButton theme="cozy" />
                  </div>
                </div>
                <div className={card + ' ' + mT1}>
                  <div className={cardImage}>
                    <img alt="outrun" className={wF} src={OutrunImage} />
                  </div>
                  <div className={cardFooter + " " + flexColumn}>
                    <p>Outrun</p>
                    <hr />
                    <ProfileThemeButton theme="outrun" />
                  </div>
                </div>
                <div className={card + ' ' + mT1}>
                  <div className={cardImage}>
                    <img alt="cyberpunk" className={wF} src={CyberpunkImage} />
                  </div>
                  <div className={cardFooter + " " + flexColumn}>
                    <p>Cyberpunk</p>
                    <hr />
                    <ProfileThemeButton theme="cyberpunk" />
                  </div>
                </div>
                <div className={card + ' ' + mT1}>
                  <div className={cardImage}>
                    <img alt="newspaper" className={wF} src={NewspaperImage} />
                  </div>
                  <div className={cardFooter + " " + flexColumn}>
                    <p>Newspaper</p>
                    <hr />
                    <ProfileThemeButton theme="newspaper" />
                  </div>
                </div>
                <div className={card + ' ' + mT1}>
                  <div className={cardImage}>
                    <img alt="skeleton" className={wF} src={SkeletonImage} />
                  </div>
                  <div className={cardFooter + " " + flexColumn}>
                    <p>Skeleton</p>
                    <hr />
                    <ProfileThemeButton theme="skeleton" />
                  </div>
                </div>
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

export default connect(mapStateToProps)(Appearance);
