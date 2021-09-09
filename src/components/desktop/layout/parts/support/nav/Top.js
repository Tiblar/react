// @flow

import React, {useState} from "react";
import {connect} from "react-redux";

import topStyles from "../../../../../../css/layout/support/top.css";

import TiblarIcon from "../../../../../../assets/svg/logo-icon.svg";
import BarsIcon from "../../../../../../assets/svg/icons/bars.svg";
import TimesIcon from "../../../../../../assets/svg/icons/times.svg";

import useWindowDimensions from "../../../../../../util/hooks/useWindowDimensions";
import {Link} from "react-router-dom";

function Top(props) {
    const {width} = useWindowDimensions();

    const [manager, setManager] = useState({
        hamburger: false,
    });

    const FullNav = () => (
        <nav className={topStyles.nav}>
            <div className={topStyles.navBrand}>
                <a href="/">
                    <TiblarIcon height={32} />
                </a>
            </div>
        </nav>
    );

    const MobileNav = () => (
        <nav className={topStyles.nav}>
            <div className={topStyles.navBrand}>
                <a href="/">
                    <TiblarIcon height={32} />
                </a>
            </div>
            <div className={topStyles.hamburger} onClick={() => { setManager({ ...manager, hamburger: !manager.hamburger }) }}>
                {
                    !manager.hamburger && <BarsIcon height={28} />
                }
                {
                    manager.hamburger && <TimesIcon height={28} />
                }
            </div>
            {
                manager.hamburger &&
                <div className={topStyles.hamburgerMenu}>
                    <div className={topStyles.items}>
                        <Link to="/support/new-idea" className={topStyles.item}>
                            New Ideas
                        </Link>
                        <Link to="/support/ticket" className={topStyles.item}>
                            Open Ticket
                        </Link>
                        {
                            !props.auth.isAuthenticated &&
                            <Link to="/login" className={topStyles.item}>
                                Login
                            </Link>
                        }
                        {
                            props.auth.user !== null &&
                            <Link to="/support/account" className={topStyles.item}>
                                Your Account ({props.auth.user.info.username})
                            </Link>
                        }
                    </div>
                </div>
            }
        </nav>
    );

    return width > 600 ? <FullNav /> : <MobileNav />
}

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth };
};

export default connect(mapStateToProps)(Top);
