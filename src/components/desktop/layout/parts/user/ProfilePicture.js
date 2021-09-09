// @flow

import React, {useState, useEffect} from "react";
import ReactTooltip from "react-tooltip";
import PropTypes from "prop-types";
import {connect} from "react-redux";

import {
  awayDot,
  disturbDot,
  offlineDot,
  onlineDot,
  statusDot
} from "../../../../../css/components/status-dots.css";
import { profile, profileContainer, small } from "../../../../../css/components/pp.css";
import { hide } from "../../../../../css/layout.css";

import ProfilePopup from "./ProfilePopup";

import history from "../../../../../util/history";
import store from "../../../../../store";
import {UserType} from "../../../../../util/types/UserTypes";
import {previewShow, previewUserId} from "../../../../../reducers/social/actions";
import ContentLoader from "../../../../../util/components/ContentLoader";

function ProfilePicture(props) {
  const [manager, setManager] = useState({
    popup: false,
    hidePopup: false,
    loaded: false,
  });

  const [delayHandler, setDelayHandler] = useState({
    show: null,
    hide: null,
  });

  const ProfileLoader = (props) => (
      <ContentLoader
          speed={2}
          width={props.small ? 40 : 55}
          height={props.small ? 40 : 55}
          viewBox={"0 0 " + (props.small ? 40 : 55) + " " + (props.small ? 40 : 55)}
      >
        <rect x="0" y="0" rx="14" ry="14" width={props.small ? 40 : 55} height={props.small ? 40 : 55} />
      </ContentLoader>
  )

  let tooltip = props.tooltip === true;
  //let showStatus = props.status !== false;
  let showStatus = false;

  function getStatusClass(status) {
    switch (status) {
      case "online":
        return onlineDot;
      case "dnd":
        return disturbDot;
      case "away":
        return awayDot;
      case "offline":
        return offlineDot;
      default:
        return offlineDot;
    }
  }

  useEffect(() => {
    return () => {
      clearTimeout(delayHandler.hide);
      clearTimeout(delayHandler.show);
    };
  }, [delayHandler]);

  const handleMouseEnter = () => {
    if(!props.profilePreview){
      return;
    }

    clearTimeout(delayHandler.hide);

    setDelayHandler({
      ...delayHandler,
      show: setTimeout(() => {
        setManager(manager => ({
          ...manager,
          popup: true,
        }))
      }, 800)
    })
  }

  const handleMouseLeave = () => {
    if(!props.profilePreview){
      return;
    }

    clearTimeout(delayHandler.show);

    setDelayHandler({
      ...delayHandler,
      hide: setTimeout(() => {
        setManager(manager => ({
          ...manager,
          popup: false,
        }));
      }, 300)
    })
  }

  function handleClick() {
    if(props.profilePreview){
      store.dispatch(previewShow(true));
      store.dispatch(previewUserId(props.user.id));

      clearTimeout(delayHandler.show);
      clearTimeout(delayHandler.hide);
    }else {
      if(props.portal.portal === "VIDEO"){
        history.push(`/channel/${props.user.info.username}`)
      }else{
        history.push(`/${props.user.info.username}`)
      }
    }
  }

  function handleLoad() {
    setManager({
      ...manager,
      loaded: true,
    })
  }

  return (
      <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={profileContainer}>
        <div
            data-tip
            data-for={props.user.userId}
            className={profile + (props.small ? ' ' + small : '') + (!manager.loaded ? ' ' + hide : '')}
        >
          <img src={props.user.info.avatar}
               onClick={handleClick}
               onLoad={handleLoad} alt="avatar" />
          {showStatus && (
              <div className={statusDot + " " + getStatusClass(props.user.info.status)} />
          )}
        </div>
        {tooltip && (
            <ReactTooltip
                id={props.user.userId}
                place="bottom"
                type="dark"
                effect="solid"
            >
              <span>{props.user.info.username}</span>
            </ReactTooltip>
        )}
        {
          !manager.loaded && <ProfileLoader small={props.small} />
        }
        {
          manager.popup && props.popup === true &&
          <ProfilePopup hide={false} user={props.user}/>
        }
      </div>
  );
}

ProfilePicture.propTypes = {
  user: UserType,
  small: PropTypes.bool,
  popup: PropTypes.bool,
  tooltip: PropTypes.bool,
  profilePreview: PropTypes.bool,
}

ProfilePicture.defaultProps = {
  small: false,
  profilePreview: false,
}

const mapStateToProps = state => {
  const { social, portal } = state;
  return { social: social, portal: portal };
};

export default connect(mapStateToProps)(ProfilePicture);
