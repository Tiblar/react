// @flow

import React from "react";
import { Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';

import layoutStyles from "../../css/layout.css";
import 'react-toastify/dist/ReactToastify.css';

import PortalNav from "../../components/desktop/layout/PortalNav";

function RouteLayout({ layout, component, ...rest }) {
    return (
        <Route
            {...rest}
            render={props =>(
                <div className={layoutStyles.flex + ' ' + layoutStyles.flexGrow + ' ' + layoutStyles.hF}>
                    <PortalNav />
                    <ToastContainer />
                    {
                        React.createElement(
                            layout,
                            props,
                            React.createElement(component, props)
                        )
                    }
                </div>
            )}
        />
    );
}

export default RouteLayout;
