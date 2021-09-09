// @flow

import React from "react";
import {connect} from "react-redux";

import Container from "../../layout/parts/social/container/LeaderboardContainer";
import LeaderboardNavTab from "../../layout/parts/social/nav/LeaderboardNav";
import Ranks from "../../layout/parts/social/leaderboard/Ranks";

import history from "../../../../util/history";

function Leaderboard(props) {

    let params = new URLSearchParams(history.location.search);

    let stat = params.get('tab');
    if(!['invites', 'likes', 'followers', 'posts'].includes(stat)){
        stat = 'invites';
    }

    return (
        <Container>
            <LeaderboardNavTab />
            <Ranks stat={stat} />
        </Container>
    );
}

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth };
};

export default connect(mapStateToProps)(Leaderboard);
