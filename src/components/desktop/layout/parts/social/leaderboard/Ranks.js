// @flow

import React from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";

import layoutStyles, {mT1, mR1, mB2, mL} from "../../../../../../css/layout.css";
import leaderboardStyles from "../../../../../../css/layout/social/leaderboard.css";
import cardStyles from "../../../../../../css/components/card.css";
import formStyles from "../../../../../../css/form.css";

import EmptyGraphic from "../../../../../../assets/graphics/empty.svg";
import CopyIcon from "../../../../../../assets/svg/icons/copy.svg";

import ProfilePicture from "../../../../layout/parts/user/ProfilePicture";

import CopyButton from "../../../../../../util/components/CopyButton";
import LoaderData from "./LoaderData";
import Error from "../feed/components/Error";

import {useLeaderboardState} from "./context";
import {WEB_URL} from "../../../../../../util/constants";
import {ordinalSuffixOf} from "../../../../../../util/formatNumber";

function Ranks(props) {


    let stat = props.stat;
    if(!['invites', 'likes', 'followers', 'posts'].includes(stat)){
        stat = 'invites';
    }

    const leaderboardState = useLeaderboardState();

    function alertStyle(index) {
        if(index === 0) {
            return (
                <div className={formStyles.alert + ' ' + leaderboardStyles.alert + '  ' + mL + ' ' + leaderboardStyles.alertFirst}>
                    1st Place
                </div>
            )
        }

        if(index === 1) {
            return (
                <div className={formStyles.alert + ' ' + leaderboardStyles.alert + '  ' + mL + ' ' + leaderboardStyles.alertSecond}>
                    2nd Place
                </div>
            )
        }

        if(index === 2) {
            return (
                <div className={formStyles.alert + ' ' + leaderboardStyles.alert + '  ' + mL + ' ' + leaderboardStyles.alertThird}>
                    3rd Place
                </div>
            )
        }

        return (
            <div className={mL + ' ' + mR1}>
                {ordinalSuffixOf(index + 1)}
            </div>
        )
    }

    return (
        <div className={leaderboardStyles.container}>
            {
                props.auth.isAuthenticated && props.auth.user !== null &&
                <div className={cardStyles.card}>
                    <div className={cardStyles.cardBody}>
                        <div className={leaderboardStyles.userRank}>
                            <ProfilePicture user={props.auth.user}/>
                            <div className={leaderboardStyles.info}>
                                <h2>{props.auth.user.info.username}</h2>
                            </div>
                            {
                                !leaderboardState.loading && !leaderboardState.error &&
                                <div className={formStyles.alert + ' ' + leaderboardStyles.alert + '  ' + mL}>
                                    {leaderboardState.stats.ranks[stat].my_total} {stat}
                                </div>
                            }
                        </div>
                        {stat === 'invites' && <hr className={mT1}/>}
                        {
                            stat === 'invites' &&
                            <div className={formStyles.formGroup}>
                                <label>Your invite link:</label>
                                <div className={layoutStyles.flex}>
                                    <input type="text" className={formStyles.input} readOnly={true} value={`${WEB_URL}/register?r=` + props.auth.user.info.username}/>
                                    <CopyButton copyText={`${WEB_URL}/register?r=` + props.auth.user.info.username}
                                                className={formStyles.button + ' ' + formStyles.buttonIcon + ' ' + layoutStyles.mL1}>
                                        <CopyIcon height={20}/>
                                    </CopyButton>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            }
            <hr className={layoutStyles.mT1 + ' ' + layoutStyles.mB1} />
            {
                !leaderboardState.loading && !leaderboardState.error &&
                leaderboardState.stats.ranks !== undefined && leaderboardState.stats.ranks[stat].list.length === 0 &&
                <div className={cardStyles.card + ' ' + mT1 + ' ' + mB2}>
                    <div className={cardStyles.cardBody}>
                        <EmptyGraphic width="100%" />
                        <hr className={layoutStyles.mT1 + ' ' + layoutStyles.mB1} />
                        <p>There are no users here right now.</p>
                    </div>
                </div>
            }
            {
                !leaderboardState.loading && !leaderboardState.error && leaderboardState.stats.ranks[stat].list.length > 0 &&
                leaderboardState.stats.ranks[stat].list.map((poster, index) => (
                    <div className={cardStyles.card + ' ' + leaderboardStyles.leaderCard} key={index}>
                        <div className={cardStyles.cardBody}>
                            <div className={leaderboardStyles.userRank}>
                                <ProfilePicture profilePreview={true} user={poster.author}/>
                                <div className={leaderboardStyles.info}>
                                    <h2>{poster.author.info.username}</h2>
                                    {
                                        stat !== 'invites' &&
                                        <span>Has {poster.count} {stat}</span>
                                    }
                                    {
                                        stat === 'invites' &&
                                        <span>Made {poster.count} invites</span>
                                    }
                                </div>
                                {alertStyle(index)}
                            </div>
                        </div>
                    </div>
                ))
            }
            {
                leaderboardState.loading &&
                <LoaderData />
            }
            {
                leaderboardState.error &&
                <Error />
            }
        </div>
    );
}

Ranks.propTypes = {
    stat: PropTypes.string.isRequired
};

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth };
};

export default connect(mapStateToProps)(Ranks);
