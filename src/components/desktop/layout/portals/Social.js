// @flow

import React  from "react";

import SocialCreate from "../parts/post/SocialCreate";
import ShouldRenderPreviewProfile from "./social/ShouldRenderPreviewProfile";
import AutoAuth from "../AutoAuth";
import {SocialProvider, useSocialState} from "../parts/social/context";
import {ManageProvider} from "../parts/post/manage/context";

function Social(props) {
    const CreatePost = () => {
        const {createPost} = useSocialState();

        if(createPost){
            return (<ManageProvider><SocialCreate /></ManageProvider>);
        }

        return null;
    };

    return (
      <SocialProvider>
          <AutoAuth>
              <ShouldRenderPreviewProfile />
              <CreatePost />
              {props.children}
          </AutoAuth>
      </SocialProvider>
  );
}

export default Social;
