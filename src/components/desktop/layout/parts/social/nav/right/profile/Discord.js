// @flow

import React, {useState} from "react";
import { connect } from "react-redux";
import ContentLoader from "../../../../../../../../util/components/ContentLoader";

import sidebarStyles from "../../../../../../../../css/layout/social/nav/sidebar.css";
import layoutStyles from "../../../../../../../../css/layout.css";
import formStyles from "../../../../../../../../css/form.css";
import cardsStyles from "../../../../../../../../css/components/sidebar-cards.css";

import CopyIcon from "../../../../../../../../assets/svg/icons/copy.svg";

import {UserType} from "../../../../../../../../util/types/UserTypes";
import CopyButton from "../../../../../../../../util/components/CopyButton";

function Discord(props) {

    const [manager, setManager] = useState({
       loading: true,
    });

    if(!props.user.connections){
        return null;
    }

    let connection = props.user.connections.find(c => (
        c.service === 'discord'
    ))

    if(!connection){
        return null;
    }

    const AvatarLoader = () => (
        <ContentLoader
            width={45}
            height={45}
            viewBox="0 0 45 45"
        >
            <rect x="0" y="0" rx="2" ry="2" width="45" height="45" />
        </ContentLoader>
    );

    return [
        (
            <div key="badges-title" className={sidebarStyles.sidebarItem + ' ' + sidebarStyles.sidebarTitle}>
                <label>Discord</label>
            </div>
        ),
        (
            <div key="badges" className={sidebarStyles.sidebarObject}>
                <div className={layoutStyles.grey}>
                    <div className={formStyles.alert + ' ' + cardsStyles.discord}>
                        <div className={cardsStyles.avatar}>
                            <img onLoad={() => { setManager({ loading: false }) }}
                                 src={connection.link}
                                 className={(manager.loading ? layoutStyles.hide : "")}
                                 alt="Discord avatar" />
                            {
                                manager.loading &&
                                <AvatarLoader />
                            }
                        </div>
                        <CopyButton copyText={connection.account} className={cardsStyles.account}>
                            <CopyIcon height={16} />
                            {connection.account}
                        </CopyButton>
                    </div>
                </div>
            </div>
        )
    ]
}

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth };
};

Discord.propTypes = {
    user: UserType.isRequired,
}

export default connect(mapStateToProps)(Discord);
