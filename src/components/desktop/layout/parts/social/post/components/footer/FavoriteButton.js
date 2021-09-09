// @flow

import React, {useState, useRef, useEffect} from "react";
import {toast} from "react-toastify";
import {connect} from "react-redux";
import axios from "axios";
import ReactTooltip from "react-tooltip";

import postStyles from "../../../../../../../../css/components/post.css";
import {button} from "../../../../../../../../css/form.css";

import HeartIcon from "../../../../../../../../assets/svg/icons/heart.svg";

import {API_URL} from "../../../../../../../../util/constants";
import store from "../../../../../../../../store";
import {favoritePost} from "../../../../../../../../reducers/social/actions";

function FavoriteButton(props) {

    let post = props.post.reblog !== null && (props.post.body === null && props.post.attachments.length === 0)
        ? props.post.reblog : props.post;

    let favoritesCount = post.favorites_count;
    let isFavorited = post.is_favorited;

    function handleFavorite() {
        if(!props.auth.isAuthenticated) return;

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        let url = isFavorited ? "unfavorite" : "favorite";

        axios
            .post(API_URL + "/post/" + url + "/" + post.id, {}, config)
            .then(res => {
                if(!props.callback){
                    store.dispatch(favoritePost(post.id))
                }else{
                    props.callback(!isFavorited);
                }
            })
            .catch(err => {
                const Notification = () => (
                    <div>
                        There was an error!
                    </div>
                );

                toast.error(<Notification />, {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            });
    }

    return (
        <div className={postStyles.likeButton}>
            {
                props.auth.isAuthenticated &&
                <button
                    className={button + ' ' + postStyles.interaction + ' ' + (isFavorited ? postStyles.liked : '')}
                    onClick={handleFavorite}>
                    <HeartIcon height="16" /><span>{favoritesCount}</span>
                </button>
            }
            <ReactTooltip id={`login-${props.post.id}`} delayShow={1000} place="top" type="dark" effect="solid">
                <span>Please login</span>
            </ReactTooltip>
            {
                !props.auth.isAuthenticated && <button data-tip data-for={`login-${props.post.id}`} className={button + ' ' + postStyles.interaction}>
                    <HeartIcon height="16" /><span>{favoritesCount}</span>
                </button>
            }
        </div>
    );
}

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth };
};

export default connect(mapStateToProps)(FavoriteButton);
