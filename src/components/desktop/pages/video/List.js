import React from "react";
import {connect} from "react-redux";

import mainStyles from "../../../../css/layout/main.css";

import PostList from "../../layout/parts/video/list/PostList";

import {SocialProvider} from "../../layout/parts/social/context";
import {ListsProvider} from "../../layout/parts/social/lists/context";
import ListsFetcher from "../../layout/parts/social/lists/ListsFetcher";
import MainContainer from "../../layout/parts/video/container/MainContainer";

function List(props) {
    return (
        <MainContainer>
            <div className={mainStyles.bottomContent}>
                <SocialProvider>
                    <ListsProvider>
                        <ListsFetcher>
                            <PostList {...props} />
                        </ListsFetcher>
                    </ListsProvider>
                </SocialProvider>
            </div>
        </MainContainer>
    );
}

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth };
};

export default connect(mapStateToProps)(List);

