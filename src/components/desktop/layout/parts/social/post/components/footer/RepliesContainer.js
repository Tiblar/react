// @flow

import React, {useState, useEffect} from "react";
import {toast} from "react-toastify";
import {connect} from "react-redux";
import axios from "axios";

import postStyles from "../../../../../../../../css/components/post.css";
import formStyles, {alert} from "../../../../../../../../css/form.css";
import layoutStyles, {mB1, mT1} from "../../../../../../../../css/layout.css";

import LoadingGraphic from "../../../../../../../../assets/loading/dots.svg";

import {API_URL} from "../../../../../../../../util/constants";

import ReplyForm from "./ReplyForm";
import Reply from "./Reply";

function RepliesContainer(props) {

    let post = props.post.reblog !== null && (props.post.body === null && props.post.attachments.length === 0)
        ? props.post.reblog : props.post;

    let [manager, setManager] = useState({
        replyTo: null,
        replies: [],
        loading: true,
    });

    useEffect(() => {

        let source = axios.CancelToken.source();
        const config = {
            headers: {
                "Content-Type": "application/json"
            },
            cancelToken: source.token,
        };

        let unmounted = false;
        axios
            .get(API_URL + "/post/replies/" + post.id, {}, config)
            .then(res => {
                if(!unmounted && res.data.data.replies !== undefined){
                    setManager(manager => ({
                        ...manager,
                        replies: res.data.data.replies,
                        loading: false,
                    }));
                }
            })
            .catch(err => {
                if(!unmounted){
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
                }
            });

        return () => {
            unmounted = true;
            source.cancel("Cancelling in cleanup");
        };
    }, []);

    function findReply(arr, id){
        if(arr.length === 0) return;

        for(let r of arr) {
            if(r.id === id)
                return r;

            let t = findReply(r.replies, id);

            if(t)
                return t;
        }
    }

    function addReply(reply) {
        let {replies} = manager;

        if(reply.parent_id === null){
            replies.push(reply);
        }else{
            let parent = findReply(replies, reply.parent_id);
            if(parent !== null){
                parent.replies.push(reply);
            }
        }

        setManager(manager => ({
            ...manager,
            replies: replies,
        }))
    }

    function replyAction(id) {
        let reply = findReply(manager.replies, id);

        setManager(manager => ({
            ...manager,
            replyTo: reply,
        }));
    }

    let replies = manager.replies.map(reply => (
        <Reply key={reply.id} reply={reply} replyAction={replyAction} />
    ));

    return (
        <React.Fragment>
            {
                props.top === true &&
                <div className={postStyles.messageContainer + ' ' + layoutStyles.mB1}>
                    <ReplyForm post={props.post} callback={addReply} replyTo={manager.replyTo} cancelReply={() => { setManager({ ...manager, replyTo: null, }) }}/>
                </div>
            }
            <div className={postStyles.repliesContainer} style={props.fill ? {maxHeight: "unset", height: "100%"} : {}}>
                {
                    manager.replies.length === 0 && !manager.loading &&
                    <div className={formStyles.alert + ' ' + mT1 + ' ' + mB1}>
                        There are no comments.
                    </div>
                }
                {
                    manager.loading &&
                    <div className={alert + ' ' + mB1 + ' ' + mT1}>
                        <LoadingGraphic width={20}/>
                        Loading replies...
                    </div>
                }
                {replies}
            </div>
            {
                props.top !== true &&
                <div className={postStyles.messageContainer}>
                    <ReplyForm post={props.post} callback={addReply} replyTo={manager.replyTo} cancelReply={() => { setManager({ ...manager, replyTo: null, }) }}/>
                </div>
            }
        </React.Fragment>
    );
}

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth };
};

export default connect(mapStateToProps)(RepliesContainer);
