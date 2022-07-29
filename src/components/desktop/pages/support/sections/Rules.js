// @flow

import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";

import supportStyles from "../../../../../css/layout/support/support.css";
import cardStyles from "../../../../../css/components/card.css";

import Container from "../../../layout/parts/support/Container";

import {SUPPORT_URL} from "../../../../../util/constants";

function Rules(props) {
    return (
        <Container>
            <div className={supportStyles.body}>
                <div className={cardStyles.card}>
                    <div className={cardStyles.cardHeader}>
                        <a href={SUPPORT_URL}>Support Home</a>&nbsp;-&nbsp;Rules
                    </div>
                    <div className={cardStyles.cardBody}>
                         <ol>
                             <li>Legal NSFW content is <b>completely allowed</b> and <b>will never</b> be removed except for DMCA requests.</li>
                             <li id="nsfw">NSFW content is any content that has nudity, sexual content, a sexually suggestive tone, or could be seen as sexual.
                                 For example pornography is explicit but the Vitruvian Man isn't. Anything else is not NSFW. We reserve the right to mark any post as NSFW.</li>
                             <li>Repeatably posting NSFW content not labeled as such will result in a ban.</li>
                             <li>You will immediately leave this website and stop accessing this website if you are under the age of 18.</li>
                             <li>You agree to not upload any data or "post" anything that breaks United States laws.</li>
                             <li>This shouldn't have to be stated, but ABSOLUTELY NO child pornography or media containing nude humans under the age of 18.
                                 ABSOLUTELY NO media of humans or human like beings under the age of 18 engaging in sex or sexuals acts. This includes animated, drawn, or CGI content
                                 along with real content.</li>
                             <li>Do not upload copyright data without permission.</li>
                             <li>You agree to not spam or flood any content.</li>
                             <li>Do not impersonate or pretend to be an admin.</li>
                             {/*
                             My account is <a href="/222/">222</a>.
                             */}
                             <li>Do not harass other users.</li>
                             <li>Do not misuse tags.</li>
                             <li>Do not break United States law or local law in the United States.</li>
                             {/*
                             I offer rewards in Bitcoin or Monero.
                             */}
                             <li>If you have found an exploit for Formerly Chuck's, <Link to="/support/pages/contact">contact us</Link> for potential reward instead of using it.</li>
                         </ol>
                    </div>
                </div>
            </div>
        </Container>
    );
}

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth };
};

export default connect(mapStateToProps)(Rules);
