// @flow

import React, {useState} from "react";

import postStyles from "../../../../../../../../css/components/post.css";

import ContentLoader from "../../../../../../../../util/components/ContentLoader";

const Image = (props) => {
    let [manager, setManager] = useState({
        loading: true
    });

    const Placeholder = () => (
        <ContentLoader
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
        >
            <rect x="0" y="0" width="100%" height="100%" />
        </ContentLoader>
    );

    function onLoad() {
        setManager({ loading: false });
    }

    return (
        <div className={postStyles.image}
             onClick={() => { props.setSlide(props.pos) }}
             style={{width: `calc(100% / ${props.rowCount})`, height: `${props.height}px`}}
             data-id={props.image.id}>
            {
                manager.loading && <Placeholder />
            }
            <img src={props.image.file.url} style={{display: (manager.loading ? "none" : "block")}}
                 onLoad={onLoad}
                 alt={props.image.file.original_name} />
        </div>
    );
};

export default Image;
