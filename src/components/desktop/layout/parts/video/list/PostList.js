import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import axios from "axios";
import {toast} from "react-toastify";

import {divider, postContainer} from "../../../../../../css/layout/social/container/main.css";
import listsStyles from "../../../../../../css/layout/social/lists.css";
import layoutStyles, {mB1, mT1} from "../../../../../../css/layout.css";
import formStyles from "../../../../../../css/form.css";
import cardStyles from "../../../../../../css/components/card.css";
import errorCardStyles from "../../../../../../css/layout/social/error-card.css";

import Error from "../../social/feed/components/Error";
import Empty from "../../social/lists/Empty";
import Loading from "../../social/feed/components/Loading";
import EditListModal from "../../social/lists/EditListModal";
import Fetcher from "../../social/feed/Fetcher";
import DefaultPost from "../../social/post/DefaultPost";
import ContentLoader from "../../../../../../util/components/ContentLoader";

import store from "../../../../../../store";
import {fetchPosts} from "../../../../../../reducers/social/actions";
import {API_URL} from "../../../../../../util/constants";
import {formatBreakDate} from "../../../../../../util/date";

function PostList(props) {

    const [manager, setManager] = useState({
        loadingList: true,
        loadingPosts: true,
        notFound: false,
        list: null,
        editList: false,
    });

    function handleEditList() {
        setManager(manager => ({
            ...manager,
            editList: !manager.editList
        }));
    }

    function handleLoadList() {
        setManager(manager => ({
            ...manager,
            loadingList: true,
        }));
    }

    function fetch() {
        let params = {};

        params.offset = props.social.offset;

        store.dispatch(fetchPosts("/list/" + props.match.params.id + "/posts", params, "posts"));
    }

    useEffect(() => {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        axios.get(API_URL + `/list/${props.match.params.id}`, config)
            .then(function (res) {
                setManager(manager => ({
                    ...manager,
                    list: res.data.data.list,
                    loadingList: false,
                }))
            })
            .catch(function (err) {
                if(err.response.status === 404){
                    setManager(manager => ({
                        ...manager,
                        notFound: true,
                    }))
                    return;
                }

                const Notification = () => (
                    <div>
                        There was an error
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
                }, 300);
            });
    }, [manager.loadingList]);

    const Placeholder = () => (
        <ContentLoader
            width="150"
            height="20"
            viewBox="0 0 150 20"
            preserveAspectRatio="none"
        >
            <rect x="0" y="0" width="150" height="20" />
        </ContentLoader>
    );

    let lastDate = null;
    let posts = [];
    props.social.posts.map((post) => {
        if(lastDate !== formatBreakDate(post.timestamp)){
            lastDate = formatBreakDate(post.timestamp);

            posts.push(
                <div key={post.id + formatBreakDate(post.timestamp)} className={divider + ' ' + mB1}>
                    {formatBreakDate(post.timestamp)}
                </div>
            );
        }

        posts.push(<DefaultPost key={post.id} postId={post.id}/>);
    });

    return (
        <Fetcher fetchPosts={fetch}>
            <div className={postContainer + ' ' + layoutStyles.mLN}>
                <div className={listsStyles.header}>
                    {manager.editList && <EditListModal list={manager.list} handleLoadList={handleLoadList} close={handleEditList} />}
                    <div className={layoutStyles.flex + ' ' + layoutStyles.alignItemsCenter}>
                        {
                            manager.list &&
                            <h3>{manager.list.title}</h3>
                        }
                        {
                            (!manager.list && !manager.notFound) &&
                            <Placeholder />
                        }
                        {
                            manager.notFound &&
                            <h3>Not found...</h3>
                        }
                        {
                            (props.auth.isAuthenticated && manager.list && manager.list.author && manager.list.author.id === props.auth.user.id) &&
                            <button className={formStyles.button + ' ' + layoutStyles.mL} onClick={handleEditList}>
                                Edit
                            </button>
                        }
                    </div>
                    {
                        manager.list && manager.list.description &&
                        <div className={layoutStyles.flex}>
                            <p style={{wordBreak: "break-all", whiteSpace: "pre-line"}}>{manager.list.description}</p>
                        </div>
                    }
                </div>
                <hr className={layoutStyles.mB1} />
                {
                    manager.notFound &&
                    <div className={cardStyles.card + ' ' + errorCardStyles.popupShow}>
                        <div className={cardStyles.cardBody}>
                            <p>This list is either private or does not exist.</p>
                        </div>
                    </div>
                }
                {
                    manager.list && (
                        <React.Fragment>
                            <div className={mT1} />
                            {
                                props.social.error &&
                                <div className={mT1}>
                                    <Error />
                                </div>
                            }
                            {
                                !props.social.loading && !props.social.error && props.social.posts.length === 0 &&
                                <div className={mT1}>
                                    <Empty />
                                </div>
                            }
                            {posts}
                            {
                                props.social.loading && !props.social.reachedEnd &&
                                <div className={mT1}>
                                    <Loading />
                                </div>
                            }
                            {
                                props.social.reachedEnd &&
                                <div className={formStyles.alert + ' ' + mT1}>
                                    You have reached the end!
                                </div>
                            }
                        </React.Fragment>
                    )
                }
            </div>
        </Fetcher>
    );
}

const mapStateToProps = state => {
    const { auth, social } = state;
    return { auth: auth, social: social };
};

export default connect(mapStateToProps)(PostList);
