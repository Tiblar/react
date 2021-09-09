import React from "react";
import {connect} from "react-redux";

import profileStyles from "../../../../css/layout/social/profile.css";

import ClockIcon from "../../../../assets/svg/icons/clock.svg";
import UserIcon from "../../../../assets/svg/icons/user.svg";
import LocationIcon from "../../../../assets/svg/icons/map-marker.svg";

import {useProfileState} from "../../layout/parts/profile/context";
import {formatFullDate} from "../../../../util/date";

function About(props) {
    const { user } = useProfileState();

    return (
        <div className={profileStyles.container}>
            {
                user !== null &&
                <div className={profileStyles.card}>
                    <div className={profileStyles.top}>
                        <h3>About</h3>
                    </div>
                    <div className={profileStyles.body}>
                        <div className={profileStyles.section}>
                            <ClockIcon height={20} width={20} /><span>Joined {formatFullDate(user.info.join_date)}</span>
                        </div>
                        <hr />
                        <div className={profileStyles.section}>
                            <UserIcon height={20} width={20} />
                            {
                                (user.info.follower_count || user.info.follower_count === 0) &&
                                <span>{user.info.follower_count} follower{user.info.follower_count !== 1 ? "s" : ""}</span>
                            }
                            {
                                !user.info.follower_count && user.info.follower_count !== 0 &&
                                <span>? followers</span>
                            }
                        </div>
                        <hr />
                        <div className={profileStyles.section}>
                            <LocationIcon height={20} width={20} /><span>{user.info.location}</span>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth };
};

export default connect(mapStateToProps)(About);
