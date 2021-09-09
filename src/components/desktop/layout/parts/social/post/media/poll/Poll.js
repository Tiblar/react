// @flow

import React, {useState, useEffect} from "react";
import PropTypes from "prop-types";
import axios from "axios";
import {connect} from "react-redux";
import Cookies from 'js-cookie'
import { Link } from 'react-router-dom'
import {toast} from "react-toastify";

import postStyles from "../../../../../../../../css/components/post.css";
import formStyles from "../../../../../../../../css/form.css";
import layoutStyles from "../../../../../../../../css/layout.css";
import radioStyles from "../../../../../../../../css/components/radio.css";

import CheckIcon from "../../../../../../../../assets/svg/icons/check.svg"

import {API_URL} from "../../../../../../../../util/constants";
import {timeTillTime} from "../../../../../../../../util/date";
import store from "../../../../../../../../store";
import {votePost} from "../../../../../../../../reducers/social/actions";

const Poll = (props) => {
    let post = props.post.reblog !== null && (props.post.body === null && props.post.attachments.length === 0)
        ? props.post.reblog : props.post;

    const [manager, setManager] = useState({
        option: null,
        viewResults: false,
    })

    useEffect(() => {
        let cookie = Cookies.get('polls');

        let polls = [];
        if(cookie){
            polls = JSON.parse(cookie);
        }

        if(polls.includes(post.id)){
            setManager(manager => ({
               ...manager,
               viewResults: true,
            }))
        }

    }, []);

    function handleOption(option) {
        if(option === manager.option){
            setManager(manager => ({
               ...manager,
               option: null
            }))

            return;
        }

        setManager(manager => ({
            ...manager,
            option: option,
        }))
    }

    function handleVote() {
        if(!props.auth.isAuthenticated || manager.option === null) return;

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        const data = {
            option: manager.option
        }

        axios
            .post(API_URL + "/post/vote/" + post.id, data, config)
            .then(res => {
                store.dispatch(votePost(post.id, manager.option))
            })
            .catch(err => {
                const Notification = () => (
                    <div>
                        There was an error!
                    </div>
                );

                setTimeout(() => {
                    toast.error(<Notification />, {
                        position: "bottom-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }, 500);
            });
    }

    function handleResults() {
        let cookie = Cookies.get('polls');

        let polls = [];
        if(cookie){
            polls = JSON.parse(cookie);
        }

        polls.push(post.id);

        Cookies.set('polls', polls, { expires: 1 });

        setManager(manager => ({
           ...manager,
           viewResults: true,
        }))
    }

    let maxVotes = Math.max.apply(Math, props.poll.options.map(o => o.votes_count))

    let winningOptions = props.poll.options.map((o, i) => {
        if(o.votes_count === maxVotes){
            return i;
        }
    });

    return (
        <div className={postStyles.poll}>
            <p>{props.poll.question}</p>
            {
                props.poll.my_vote === null && !manager.viewResults && !props.poll.expired &&
                <div className={postStyles.options}>
                    {
                        props.poll.options.map((option, i) => (
                            <label key={i} className={layoutStyles.mT1}>
                                <input name="view"
                                       checked={manager.option === (i + 1)}
                                       onClick={() => { handleOption(i + 1) }}
                                       onChange={() => {}}
                                       className={radioStyles.withGap}
                                       type="radio" />
                                <span>{option.title}</span>
                            </label>
                        ))
                    }
                    {
                        manager.option !== null &&
                        <div className={layoutStyles.flex + ' ' + layoutStyles.mT1}>
                            {
                                props.auth.isAuthenticated &&
                                <button
                                    onClick={handleVote}
                                    className={formStyles.button + ' ' + formStyles.buttonPrimary}>
                                    vote
                                </button>
                            }
                            {
                                !props.auth.isAuthenticated &&
                                <Link to="/login" className={formStyles.button + ' ' + formStyles.buttonPrimary}>
                                    login
                                </Link>
                            }
                        </div>
                    }
                </div>
            }
            {
                (props.poll.my_vote !== null || props.poll.expired || manager.viewResults) &&
                <div className={postStyles.results}>
                    {
                        props.poll.options.map((option, i) => (
                            <div key={i} className={formStyles.progress + ' ' + formStyles.poll + ' ' + layoutStyles.mT1}>
                                <div className={formStyles.bar + ' ' + (winningOptions.includes(i) ? formStyles.active : '')}
                                     style={{width: (100 * (option.votes_count/props.poll.votes_count)) + "%"}}>
                                    <p>
                                        {option.title}
                                        {
                                            (props.poll.my_vote !== null && (props.poll.my_vote.option - 1) === i) &&
                                            <CheckIcon height={14}/>
                                        }
                                    </p>
                                </div>
                                {
                                    props.poll.votes_count > 0 &&
                                    <span className={postStyles.percent}>
                                        {(Math.floor(100 * (option.votes_count/props.poll.votes_count))) + "%"}
                                    </span>
                                }
                            </div>
                        ))
                    }
                </div>
            }
            <div className={postStyles.info}>
                {
                    timeTillTime(props.poll.expire_timestamp) &&
                    <span>{timeTillTime(props.poll.expire_timestamp)} left</span>
                }
                {
                    timeTillTime(props.poll.expire_timestamp) &&
                    <span>-</span>
                }
                <span>{props.poll.votes_count} vote{props.poll.votes_count === 1 ? "" : "s"}</span>
                {props.poll.my_vote === null && !props.poll.expired && !manager.viewResults && <span>-</span>}
                {
                    props.poll.my_vote === null && !props.poll.expired && !manager.viewResults &&
                    <span>
                        <a onClick={handleResults}>Show Results</a>
                    </span>
                }
                {props.poll.expired && !manager.viewResults && <span>-</span>}
                {props.poll.expired && !manager.viewResults && <span>Poll Finished</span>}
            </div>
        </div>
    );
};

Poll.propTypes = {
    poll: PropTypes.object.isRequired,
}

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth };
};

export default connect(mapStateToProps)(Poll);
