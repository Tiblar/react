// @flow

import React, {useEffect, useRef, useState} from "react";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";
import {toast} from "react-toastify";

import {flex, wF} from "../../css/layout.css";

function CopyButton(props) {
    const [manager, setManager] = useState({
        copied: false,
    });

    const _isMounted = useRef(true);

    useEffect(() => {
        return () => {
            _isMounted.current = false
        }
    }, []);

    const copyToClipboard = (text) => {
        let textField = document.createElement('textarea')
        textField.innerText = text
        document.body.appendChild(textField)
        textField.select()
        document.execCommand('copy')
        textField.remove()

        setManager(manager => ({
            ...manager,
            copied: true,
        }));

        ReactTooltip.rebuild();

        setTimeout(() => {
            if(_isMounted.current){
                setManager(manager => ({
                    ...manager,
                    copied: false,
                }));

                ReactTooltip.rebuild();
            }
        }, 1000);

        const Notification = () => (
            <div>
                Copied!
            </div>
        );

        if(props.toast){
            toast(<Notification />, {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    let unique = Math.random().toString(36).substring(7);

    return (
        <div className={flex + ' ' + wF}>
            <ReactTooltip id={"copy-id-" + unique} place="top" type="dark" effect="solid">
                {
                    manager.copied &&
                    <span>Copied!</span>
                }
                {
                    !manager.copied &&
                    <span>Copy</span>
                }
            </ReactTooltip>
            <button className={props.className} data-tip data-for={"copy-id-" + unique} onClick={() => {copyToClipboard(props.copyText)}}>
                {props.children}
            </button>
        </div>
    );
}

CopyButton.propTypes = {
    className: PropTypes.string,
    toast: PropTypes.bool,
    copyText: PropTypes.string.isRequired
}

CopyButton.defaultProps = {
    toast: true,
}

export default CopyButton;
