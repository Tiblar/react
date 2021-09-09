import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";

import PlusIcon from "../../../../../assets/svg/icons/plus.svg";

import formStyles from "../../../../../css/form.css";
import layoutStyles from "../../../../../css/layout.css";
import cardStyles from "../../../../../css/components/card.css";

import {CREATE_POST as CREATE_POST_SOCIAL, useSocialDispatch} from "../social/context";
import {CREATE_POST as CREATE_POST_VIDEO, useVideoDispatch} from "../video/context";

import useWindowDimensions from "../../../../../util/hooks/useWindowDimensions";

function SidebarPostButton(props) {

    const [manager, setManager] = useState({
       social: false,
       video: false,
    });

    const {width} = useWindowDimensions();

    const VideoButton = () => {
        const dispatch = useVideoDispatch();

        useEffect(() => {
            dispatch({ type: CREATE_POST_VIDEO, payload: true })
        }, [])

        return null;
    }

    const SocialButton = () => {
        const dispatch = useSocialDispatch();

        useEffect(() => {
            dispatch({ type: CREATE_POST_SOCIAL, payload: true })
        }, [])

        return null;
    };

    function newPost() {
        if(props.video){
            setManager(manager => ({
                ...manager,
                video: true,
            }))
        }else{
            setManager(manager => ({
                ...manager,
                social: true,
            }))
        }
    }

    return (
        <>
            {manager.video ? <VideoButton /> : null}
            {manager.social ? <SocialButton /> : null}
            {
                (width <= 1500 && width > 1100) &&
                <button className={formStyles.button + " " + formStyles.buttonIcon + " " + layoutStyles.wF} onClick={newPost}>
                    <PlusIcon height="25" />
                </button>
            }
            {
                (width > 1500 || (width > 700 && width <= 1100)) &&
                <div className={cardStyles.card}>
                    <div className={cardStyles.cardBody}>
                        <button className={formStyles.button + " " + layoutStyles.wF} onClick={newPost}>
                            <PlusIcon height="15" />
                            New Post
                        </button>
                    </div>
                </div>
            }
            {
                width <= 700 &&
                <button className={formStyles.button + " " + layoutStyles.wF} onClick={newPost}>
                    <PlusIcon height="15" />
                    New Post
                </button>
            }
        </>
    );
}

SidebarPostButton.propTypes = {
    video: PropTypes.bool,
}

SidebarPostButton.defaultProps = {
    video: false,
}

export default SidebarPostButton;
