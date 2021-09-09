// @flow

import React, { useRef, useState, useEffect, Suspense } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { connect } from "react-redux";
import axios from "axios";
const Picker = React.lazy(
    () => import('emoji-mart').then(module => ({ default: module.Picker }))
);
import {toast} from "react-toastify";
import ReactTooltip from "react-tooltip";
import 'emoji-mart/css/emoji-mart.css'
import {isMobile} from "is-mobile";

import formStyles, { button, buttonIcon } from "../../../../../../../../css/form.css";
import mBoxStyles, {
  container,
  box,
  textContainer,
  textInput,
  buttonOption,
  replyTo
} from "../../../../../../../../css/layout/chat/message-box.css";

import SendIcon from "../../../../../../../../assets/svg/icons/send.svg";
import EmojiIcon from "../../../../../../../../assets/svg/icons/smile.svg";
import EmojiSheet from "../../../../../../../../assets/emojis/sheet/64.png";

import { API_URL } from "../../../../../../../../util/constants";
import outsideClick from "../../../../../../../../util/components/outsideClick";
import {ReplyType} from "../../../../../../../../util/types/PostTypes";
import fetchCaptcha from "../../../../../../../../util/captcha";
import modalStyles from "../../../../../../../../css/components/modal.css";
import layoutStyles, {mL} from "../../../../../../../../css/layout.css";
import ContentLoader from "../../../../../../../../util/components/ContentLoader";
import {CONTAINER, LAYER, useLayerDispatch} from "../../../../../layer/context";
import Upgrade from "../../../../../../pages/settings/Upgrade";
import Container from "../../../../settings/Container";

function ReplyForm(props) {
  let post = props.post.reblog !== null && (props.post.body === null && props.post.attachments.length === 0)
      ? props.post.reblog : props.post;

  let ref = useRef();
  let containerRef = useRef();
  const _isMounted = useRef(true);
  const securityCodeRef = useRef();

  const dispatchLayer = useLayerDispatch();

  let [manager, setManager] = useState({
    input: "",
    sending: false,
    showEmojis: false,
    caretPos: 0,
    securityCode: "",
    showCaptcha: false,
    captchaURL: null,
    captchaId: null,
    captchaLoading: true,
    error: null,
  });

  useEffect(() => {
    return () => {
      _isMounted.current = false
    }
  }, []);

  useEffect(() => {
    if(securityCodeRef.current){
      securityCodeRef.current.focus();
    }
  }, [securityCodeRef.current]);

  useEffect(() => {
    if(ref.current.value !== undefined && manager.input.length > 0){
      ref.current.setSelectionRange(manager.caretPos, manager.caretPos);
      ref.current.focus();
    }
  }, [manager.caretPos]);

  useEffect(() => {
    if(props.replyTo !== null){
      let {input} = manager;

      input = "@" + props.replyTo.author.info.username + " " + input;

      setManager(manager => ({
        ...manager,
        input
      }))

      ref.current.focus();
    }
  }, [props.replyTo]);

  function isEmptyOrSpaces(str){
    return str === null || str.match(/^ *$/) !== null;
  }

  function sendContentMessage() {
    if(isEmptyOrSpaces(manager.input)){
      ref.current.focus();
      return;
    }

    if(manager.sending){
      return;
    }

    if(props.auth.user !== null && !props.auth.user.boosted && manager.securityCode.length === 0){
      setManager(manager => ({
        ...manager,
        showCaptcha: true,
      }))

      loadCaptcha();
      return;
    }

    setManager(manager => ({
      ...manager,
      sending: true
    }))

    const config = {
      headers: {
        "Content-Type": "application/json",
      }
    };

    let parent = props.replyTo === null || props.replyTo === undefined ? null : props.replyTo.id;
    const body = JSON.stringify({
      body: manager.input,
      parent: parent,
      security_id: manager.captchaId,
      security_code: manager.securityCode,
    });

    axios
        .post(API_URL + "/post/reply/" + post.id, body, config)
        .then(res => {
          setManager(manager => ({
            ...manager,
            input: "",
            error: null,
            showCaptcha: false,
            securityCode: "",
            sending: false,
          }));

          props.cancelReply();
          props.callback(res.data.data.reply);
        })
        .catch(err => {
          if(err.response !== null && err.response.status === 429 || err.response.status === 403){
            setManager({
              ...manager,
              error: err.response.data.message,
              showCaptcha: false,
              sending: false,
            });
            return;
          }

          if(err.response && err.response.data.errors && err.response.data.errors.captcha){
            setManager(manager => ({ ...manager, error: "WRONG_SECURITY_CODE", showCaptcha: true }));
            loadCaptcha();
            return;
          }

          const Notification = () => (
              <div>
                There was an error
              </div>
          );

          toast.error(<Notification />, {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });

    ref.current.focus();
  }

  function handleSubmit(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      sendContentMessage();
    }
  }

  const getCaretPos = (ref) => {
    return ref.current.selectionStart;
  };

  function handleInput(e) {
    let value = e.target.value;

    setManager(manager => ({
      ...manager,
      input: value,
      caretPos: getCaretPos(ref),
    }));
  }

  function handleEmoji(emoji) {
    let pos = getCaretPos(ref);
    let {input} = manager;

    let shouldLPad = input.substring(0, pos).charAt(pos) !== " " && input.length > 0;
    let shouldRPad = input.charAt(pos) !== " " && input.length > 0;

    let update = input.substring(0, pos) + (shouldLPad ? " ": "") + emoji.colons + (shouldRPad ? " ": "") + input.substring(pos);

    setManager(manager => ({
      ...manager,
      input: update,
      caretPos: pos + emoji.colons.length + 1,
    }));
  }

  function loadCaptcha() {
    fetchCaptcha().then(data => {
      if(_isMounted.current) {
        setManager(manager => ({
          ...manager,
          captchaURL: data.captcha,
          captchaId: data.id,
        }))
      }
    });
  }

  function handleSecurityCode(e) {
    let value = e.target.value;

    setManager(manager => ({
      ...manager,
      securityCode: value
    }))
  }

  function handleUpgrade() {
    dispatchLayer({ type: LAYER, payload: <Upgrade /> });
    dispatchLayer({ type: CONTAINER, payload: <Container /> });
  }

  outsideClick(containerRef, () => {
    setManager({
      ...manager,
      showEmojis: false,
    });
  });

  const backgroundImageFn = () => EmojiSheet;

  const CaptchaPlaceholder = () => (
      <ContentLoader
          width="100%"
          height="135"
          viewBox="0 0 100 135"
          preserveAspectRatio="none"
      >
        <rect x="0" y="0" width="100%" height="135" />
      </ContentLoader>
  );

  return (
      <div className={box}>
        {
          manager.showCaptcha &&
          <div className={modalStyles.containerOuter + (isMobile() ? (" " + modalStyles.mobile) : "")}>
            <div className={modalStyles.wrapper}>
              <div className={modalStyles.containerInner}>
                <div className={modalStyles.modalContainer}>
                  <div className={modalStyles.modal}>
                    <div className={modalStyles.top}>
                      <div className={modalStyles.header}>
                        <h4>Complete captcha</h4>
                      </div>
                    </div>
                    <div className={modalStyles.body}>
                      <div className={formStyles.formGroup}>
                        {
                          manager.captchaURL &&
                          <img
                              alt="captcha"
                              className={layoutStyles.wF + ' ' + (manager.captchaLoading ? layoutStyles.hide : '')}
                              onLoad={() => { setManager(manager => ({ ...manager, captchaLoading: false })) }}
                              src={manager.captchaURL}
                          />
                        }
                        {
                          (!manager.captchaURL || manager.captchaLoading) && <CaptchaPlaceholder />
                        }
                      </div>
                      <div className={formStyles.formGroup}>
                        <div className={formStyles.alert}>
                          <div>
                            <p>You can <a onClick={handleUpgrade} className={layoutStyles.pointer}>upgrade your account</a> for $3.95/mo to remove captchas (this prevents bots) while supporting development the site.</p>
                          </div>
                        </div>
                      </div>
                      <div className={formStyles.formGroup}>
                        {
                          manager.error === "WRONG_SECURITY_CODE" && <label className={formStyles.invalidLabel}>Incorrect security code.</label>
                        }
                        <input
                            type="text"
                            ref={securityCodeRef}
                            onChange={handleSecurityCode}
                            onKeyPress={handleSubmit}
                            value={manager.securityCode}
                            maxLength={4}
                            className={
                              formStyles.input + ' ' +
                              (manager.error === "WRONG_SECURITY_CODE" ? formStyles.invalidInput : '')
                            }
                            placeholder="Security code"
                        />
                      </div>
                    </div>
                    <div className={modalStyles.footer}>
                      <button className={formStyles.button}
                              onClick={() => { setManager(manager => ({ ...manager, showCaptcha: false, securityCode: "", sending: false, })) }}>
                        Close
                      </button>
                      <button className={formStyles.button + ' ' + formStyles.buttonPrimary + ' ' + mL}
                              onClick={sendContentMessage}>
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
        {
          props.replyTo !== null && props.replyTo !== undefined &&
          <div className={replyTo}>
            <small>Replying to {props.replyTo.author.info.username} <a onClick={props.cancelReply}>(cancel)</a></small>
          </div>
        }
        {
          manager.error !== "WRONG_SECURITY_CODE" &&
          <div className={mBoxStyles.errorMessage}>
            <small>{manager.error}</small>
          </div>
        }
        <div className={container + ' ' + (manager.error !== null ? mBoxStyles.error : '')} ref={containerRef}>
          <ReactTooltip id="emoji-coming-soon" place="top" type="dark" effect="solid">
            <span>Coming soon!</span>
          </ReactTooltip>
          <button
              data-tip
              data-for="emoji-coming-soon"
              disabled={!props.auth.isAuthenticated}
              className={button + " " + buttonOption + " " + buttonIcon}>
            <EmojiIcon height="75%" />
          </button>
       {/*   <button
              className={button + " " + buttonOption + " " + buttonIcon}
              onClick={() => { setManager({ ...manager, showEmojis: !manager.showEmojis }) }}>
            <EmojiIcon height="75%" />
          </button>*/}
          {
            manager.showEmojis &&
            <div className={mBoxStyles.emojiContainer}>
              <Suspense fallback={<div className={layoutStyles.mT1}>Loading...</div>}>
                <Picker
                    title='emojis!'
                    emoji='point_up'
                    color='#7286e9'
                    set='twitter'
                    backgroundImageFn={backgroundImageFn}
                    i18n={{
                      categories: {
                        search: 'Search',
                        recent: 'Frequently Used',
                        smileys: 'Smileys',
                        people: 'People',
                        nature: 'Nature',
                        foods: 'Food',
                        activity: 'Activity',
                        places: 'Travel',
                        objects: 'Objects',
                        symbols: 'Symbols',
                        flags: 'Flags',
                        custom: 'Custom',
                      },
                    }}
                    onSelect={handleEmoji}/>
              </Suspense>
            </div>
          }
          <div className={textContainer}>
            <TextareaAutosize
                disabled={!props.auth.isAuthenticated}
                placeholder={!props.auth.isAuthenticated ? "Please login." : "Your comment..."}
                onKeyPress={handleSubmit}
                onChange={handleInput}
                maxRows={3}
                rows={1}
                maxLength={280}
                inputRef={ref}
                className={textInput}
                value={manager.input}
            />
          </div>
          <button
              disabled={!props.auth.isAuthenticated}
              onClick={sendContentMessage}
              className={button + " " + buttonOption + " " + buttonIcon}
          >
            <SendIcon height="50%" />
          </button>
        </div>
      </div>
  );
}

const mapStateToProps = state => {
  const { auth } = state;
  return { auth: auth };
};

ReplyForm.propTypes = {
  replyTo: ReplyType,
};

export default connect(mapStateToProps)(ReplyForm);
