// @flow

import React, {useRef, useState} from "react";
import {connect} from "react-redux";
import {axios} from "axios";
import ReactTooltip from "react-tooltip";

import {
    formGroup,
    input,
    button, buttonPrimary,
    alert, check, muted, small
} from "../../../../../../css/form.css";
import {
    mR1, mT1, mL
} from "../../../../../../css/layout.css";
import modalStyles from "../../../../../../css/components/modal.css";
import subscriptionStyles from "../../../../../../css/layout/video/channel/subscription-modal.css";
import cardStyles from "../../../../../../css/components/card.css";
import emojiStyles from "../../../../../../css/components/emoji-selector.css";

import CheckIcon from "../../../../../../assets/svg/icons/check.svg";
import StarIcon from "../../../../../../assets/svg/icons/star.svg";
import TadaIcon from "../../../../../../assets/emojis/1f389.svg";

import { API_URL } from "../../../../../../util/constants";
import useWindowDimensions from "../../../../../../util/hooks/useWindowDimensions";
import {scrollbar} from "../../../../../../css/components/scroll.css";

const SendRequest = (props) => {
    const ref = useRef();
    const { width } = useWindowDimensions();

    let [manager, setManager] = useState({
        show: false,
    });

    function sendRequest() {

    }

    let modalWidth = "450px";
    if(width >= 1900){
        modalWidth = "650px";
    }else if(width < 1900 && width > 1200){
        modalWidth = "550px";
    }

    return (
        <div className={modalStyles.containerOuter}>
            <div className={modalStyles.containerInner} style={{width: modalWidth}}>
                <div style={{background: "url(https://www.secretshoresmusic.com/wp-content/uploads/2017/01/rsz_canti_banner-585x148.png)"}}>
                    <div className={modalStyles.top + ' ' + subscriptionStyles.top}>
                        <div className={modalStyles.header + ' ' + subscriptionStyles.header}>
                            <TadaIcon width={30} className={mR1}/>
                            <h3>Subscribe to Senko</h3>
                        </div>
                    </div>
                </div>
                <div className={modalStyles.body + ' ' + scrollbar}>
                    <div className={cardStyles.card}>
                        <div className={cardStyles.cardHeader}>
                            <h3>Supporter Tier</h3>
                            <p className={mL}>$3.99/month</p>
                        </div>
                        <div className={cardStyles.cardBody}>
                            <p className={muted + ' ' + small} style={{marginBottom: "0.75rem"}}>REWARDS:</p>
                            <div className={check}>
                                <CheckIcon width="15" />
                                <span>Access to exclusive posts, streams, and more.</span>
                            </div>
                            <div className={check}>
                                <CheckIcon width="15" />
                                <span>Use 3 custom emojis in the stream chat.</span>
                            </div>
                            <div className={emojiStyles.row + ' ' + subscriptionStyles.emojis}>
                                <div className={emojiStyles.emoji} data-tip data-for="emoji-woman">
                                    <img src="https://static-cdn.jtvnw.net/emoticons/v1/301533659/1.0" alt=":woman:" />
                                </div>
                                <ReactTooltip id="emoji-woman" place="top" type="dark" effect="solid">
                                    <span>:woman:</span>
                                </ReactTooltip>
                                <div className={emojiStyles.emoji} data-tip data-for="emoji-uwu">
                                    <img src="https://static-cdn.jtvnw.net/emoticons/v1/301791916/1.0" alt=":uwu:" />
                                </div>
                                <ReactTooltip id="emoji-uwu" place="top" type="dark" effect="solid">
                                    <span>:uwu:</span>
                                </ReactTooltip>
                                <div className={emojiStyles.emoji} data-tip data-for="emoji-angry">
                                    <img src="https://static-cdn.jtvnw.net/emoticons/v1/301517338/1.0" alt=":angry:" />
                                </div>
                                <ReactTooltip id="emoji-angry" place="top" type="dark" effect="solid">
                                    <span>:angry:</span>
                                </ReactTooltip>
                            </div>
                            <div className={check}>
                                <CheckIcon width="15" />
                                <span>Join the private Formerly Chuck's Group.</span>
                            </div>
                            <div className={check}>
                                <CheckIcon width="15" />
                                <span>Talk in stream chat when in limited mode.</span>
                            </div>
                            <div className={mT1}>
                                <button className={button + ' ' + buttonPrimary}><StarIcon width={15}/>Join</button>
                            </div>
                        </div>
                    </div>
                    <div className={cardStyles.card + ' ' + mT1}>
                        <div className={cardStyles.cardHeader}>
                            <h3>King Tier</h3>
                            <p className={mL}>$6.99/month</p>
                        </div>
                        <div className={cardStyles.cardBody}>
                            <p className={muted + ' ' + small} style={{marginBottom: "0.75rem"}}>REWARDS:</p>
                            <div className={check}>
                                <CheckIcon width="15" />
                                <span>Access previous tier and a weekly Q&A.</span>
                            </div>
                            <div className={check}>
                                <CheckIcon width="15" />
                                <span>Use 5 more custom emojis in the stream chat.</span>
                            </div>
                            <div className={emojiStyles.row + ' ' + subscriptionStyles.emojis}>
                                <div className={emojiStyles.emoji} data-tip data-for="emoji-woman">
                                    <img src="https://static-cdn.jtvnw.net/emoticons/v1/301533659/1.0" alt=":woman:" />
                                </div>
                                <ReactTooltip id="emoji-woman" place="top" type="dark" effect="solid">
                                    <span>:woman:</span>
                                </ReactTooltip>
                                <div className={emojiStyles.emoji} data-tip data-for="emoji-uwu">
                                    <img src="https://static-cdn.jtvnw.net/emoticons/v1/301791916/1.0" alt=":uwu:" />
                                </div>
                                <ReactTooltip id="emoji-uwu" place="top" type="dark" effect="solid">
                                    <span>:uwu:</span>
                                </ReactTooltip>
                                <div className={emojiStyles.emoji} data-tip data-for="emoji-angry">
                                    <img src="https://static-cdn.jtvnw.net/emoticons/v1/301517338/1.0" alt=":angry:" />
                                </div>
                                <ReactTooltip id="emoji-angry" place="top" type="dark" effect="solid">
                                    <span>:angry:</span>
                                </ReactTooltip>
                                <div className={emojiStyles.emoji} data-tip data-for="emoji-angry">
                                    <img src="https://static-cdn.jtvnw.net/emoticons/v1/301517338/1.0" alt=":angry:" />
                                </div>
                                <ReactTooltip id="emoji-angry" place="top" type="dark" effect="solid">
                                    <span>:angry:</span>
                                </ReactTooltip>
                                <div className={emojiStyles.emoji} data-tip data-for="emoji-angry">
                                    <img src="https://static-cdn.jtvnw.net/emoticons/v1/301517338/1.0" alt=":angry:" />
                                </div>
                                <ReactTooltip id="emoji-angry" place="top" type="dark" effect="solid">
                                    <span>:angry:</span>
                                </ReactTooltip>
                            </div>
                            <div className={check}>
                                <CheckIcon width="15" />
                                <span>Send gifs in the stream chat.</span>
                            </div>
                            <div className={mT1}>
                                <button className={button + ' ' + buttonPrimary}><StarIcon width={15}/>Join</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={modalStyles.footer}>
                    <button className={button} ref={ref} onClick={props.callback}>Close</button>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth };
};

export default connect(mapStateToProps)(SendRequest);
