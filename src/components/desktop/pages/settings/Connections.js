// @flow

import React from "react";
import { connect } from "react-redux";
import ReactTooltip from "react-tooltip";

import {
  card,
  cardBody
} from "../../../../css/layout/social/settings/card.css";
import { disconnected } from "../../../../css/layout/social/settings/pages/connections.css";
import { button } from "../../../../css/form.css";
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

import SteamIcon from "../../../../assets/svg/logos/steam.svg";
import TwitchIcon from "../../../../assets/svg/logos/twitch.svg";
import MyAnimeListIcon from "../../../../assets/svg/logos/myanimelist.svg";
import YouTubeIcon from "../../../../assets/svg/logos/youtube.svg";

import Discord from "../../layout/parts/settings/connections/Discord";

function Connections(props) {
  return (
    <div>
      <h3>Connections</h3>
      <div className={card}>
        <div className={cardBody}>
          <div className={tbRowM + " " + mB1}>
            <div className={tbCol12}>
              <div className={card}>
                <div
                  className={
                    cardBody +
                    " " +
                    flex +
                    " " +
                    flexRow +
                    " " +
                    alignItemsCenter
                  }
                  data-tip
                  data-for="coming-soon-steam"
                >
                    <SteamIcon height="35" />
                    <div className={mL1}>
                        <p>Steam</p>
                        <p className={disconnected}>Disconnected</p>
                    </div>
                    <ReactTooltip id="coming-soon-steam" place="right" type="dark" effect="solid">
                        <span>Coming soon!</span>
                    </ReactTooltip>
                    <div className={mL}>
                        <button
                            className={button}
                            disabled={true}>
                            Connect
                        </button>
                    </div>
                </div>
              </div>
            </div>
          </div>
          <div className={tbRowM + " " + mB1}>
            <div className={tbCol12}>
              <div className={card}>
                <div
                  className={
                    cardBody +
                    " " +
                    flex +
                    " " +
                    flexRow +
                    " " +
                    alignItemsCenter
                  }
                  data-tip
                  data-for="coming-soon-twitch"
                >
                    <TwitchIcon height="35" />
                    <div className={mL1}>
                        <p>Twitch</p>
                        <p className={disconnected}>Disconnected</p>
                    </div>
                    <ReactTooltip id="coming-soon-twitch" place="right" type="dark" effect="solid">
                        <span>Coming soon!</span>
                    </ReactTooltip>
                    <div className={mL}>
                        <button
                            className={button}
                            disabled={true}>
                            Connect
                        </button>
                    </div>
                </div>
              </div>
            </div>
          </div>
          <div className={tbRowM + " " + mB1}>
            <div className={tbCol12}>
                <Discord />
            </div>
          </div>
          <div className={tbRowM + " " + mB1}>
            <div className={tbCol12}>
              <div className={card}>
                <div
                  className={
                    cardBody +
                    " " +
                    flex +
                    " " +
                    flexRow +
                    " " +
                    alignItemsCenter
                  }
                  data-tip
                  data-for="coming-soon-youtube"
                >
                    <YouTubeIcon height="35" />
                    <div className={mL1}>
                        <p>YouTube</p>
                        <p className={disconnected}>Disconnected</p>
                    </div>
                    <ReactTooltip id="coming-soon-youtube" place="right" type="dark" effect="solid">
                        <span>Coming soon!</span>
                    </ReactTooltip>
                    <div className={mL}>
                        <button
                            className={button}
                            disabled={true}>
                            Connect
                        </button>
                    </div>
                </div>
              </div>
            </div>
          </div>
          <div className={tbRowM + " " + mB1}>
            <div className={tbCol12}>
              <div className={card}>
                <div
                  className={
                    cardBody +
                    " " +
                    flex +
                    " " +
                    flexRow +
                    " " +
                    alignItemsCenter
                  }
                  data-tip
                  data-for="coming-soon-mal"
                >
                  <MyAnimeListIcon height="35" />
                  <div className={mL1}>
                    <p>MyAnimeList</p>
                    <p className={disconnected}>Disconnected</p>
                  </div>
                    <ReactTooltip id="coming-soon-mal" place="right" type="dark" effect="solid">
                        <span>Coming soon!</span>
                    </ReactTooltip>
                  <div className={mL}>
                    <button
                        className={button}
                        disabled={true}>
                        Connect
                    </button>
                  </div>
                </div>
              </div>
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

export default connect(mapStateToProps)(Connections);
