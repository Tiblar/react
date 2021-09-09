import React from "react";
import Loader from "react-content-loader";

function ContentLoader(props) {
    return (
        <Loader
            backgroundColor={
                getComputedStyle(document.getElementById('mount'))
                    .getPropertyValue('--loader-background')
            }
            foregroundColor={
                getComputedStyle(document.getElementById('mount'))
                    .getPropertyValue('--loader-foreground')
            }
            {...props}
        >
            {props.children}
        </Loader>
    )
}

export default ContentLoader;