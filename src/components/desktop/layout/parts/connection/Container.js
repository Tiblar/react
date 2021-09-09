// @flow

import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";

import layoutStyles from "../../../../../css/layout.css";
import containerStyles from "../../../../../css/components/container.css";
import topStyles from "../../../../../css/layout/support/top.css";

import ConnectGraphic from "../../../../../assets/graphics/connect.svg";
import TiblarIcon from "../../../../../assets/svg/logo-icon.svg";
import useWindowDimensions from "../../../../../util/hooks/useWindowDimensions";
import {MAX_MOBILE_WIDTH} from "../../../../../util/constants";

function Container(props) {
    const {width} = useWindowDimensions();

    if(width > MAX_MOBILE_WIDTH){
        return (
            <div className={containerStyles.container}>
                <nav className={topStyles.nav + ' ' + topStyles.border}>
                    <div className={topStyles.navBrand}>
                        <a href="/">
                            <TiblarIcon height={32} />
                        </a>
                    </div>
                    <div className={topStyles.menu}>
                        <div className={topStyles.items}>
                            {
                                props.auth.isAuthenticated &&
                                <Link to="/social" className={topStyles.item}>
                                    Home
                                </Link>
                            }
                        </div>
                    </div>
                </nav>
                <div className={layoutStyles.tbRowM + ' ' + layoutStyles.mT3}>
                    <div className={layoutStyles.tbCol6}>
                        <ConnectGraphic width="100%" />
                    </div>
                    <div className={layoutStyles.tbCol6}>
                        {props.children}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={containerStyles.container}>
            <nav className={topStyles.nav + ' ' + topStyles.border}>
                <div className={topStyles.navBrand}>
                    <a href="/">
                        <TiblarIcon height={32} />
                    </a>
                </div>
                <div className={topStyles.menu}>
                    <div className={topStyles.items}>
                        {
                            props.auth.isAuthenticated &&
                            <Link to="/social" className={topStyles.item}>
                                Home
                            </Link>
                        }
                    </div>
                </div>
            </nav>
            <div className={layoutStyles.tbRowM + ' ' + layoutStyles.mT3}>
                <div className={layoutStyles.tbCol12}>
                    {props.children}
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth };
};

export default connect(mapStateToProps)(Container);
