import React, {useEffect} from "react";

import matrixStyles from "../../../../css/components/matrix-chat.css";

function Matrix() {

    useEffect(() => {
        const iframe = document.getElementById("matrix-iframe");

        if(iframe){
            const iframeWindow = iframe.contentWindow;

            iframeWindow.addEventListener('hashchange', function(){
                window.location.hash = iframeWindow.location.hash;
            });
        }
    }, []);

    const hash = window.location.hash;

    return (
        <iframe className={matrixStyles.iframe} id="matrix-iframe" src={"/matrix/index.html" + hash} />
    );
}

export default Matrix;
