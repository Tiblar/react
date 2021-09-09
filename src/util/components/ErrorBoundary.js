import React from "react";
import {toast} from "react-toastify";
import {connect} from "react-redux";

import layoutStyles from '../../css/layout.css';

import {updateError} from "../../reducers/error/actions";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.props.updateError(true);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className={layoutStyles.flex + ' ' + layoutStyles.flexExpandAuto + ' ' + layoutStyles.flexColumn + ' ' + + layoutStyles.p1}>
                   <div className={layoutStyles.mA}>
                       <h3 className={layoutStyles.mT1}>Something went wrong.</h3>
                       <hr />
                       <p className={layoutStyles.mT1}>
                           Refresh the page, if this continues contact support.
                       </p>
                   </div>
                </div>
            );
        }

        return this.props.children;
    }
}

const mapStateToProps = state => {
    const { error } = state;
    return { error: error };
};

const mapDispatchToProps = dispatch => {
    return {
        updateError: error => dispatch(updateError(error))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ErrorBoundary);
