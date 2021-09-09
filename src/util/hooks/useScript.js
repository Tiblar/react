import { useEffect } from 'react';

function isLoaded(url) {
    let scripts = document.getElementsByTagName('script');
    for (let i = scripts.length; i--;) {
        if (scripts[i].src == url) return true;
    }
    return false;
}

const useScript = url => {
    useEffect(() => {
        if(isLoaded(url)){
            return;
        }

        const script = document.createElement('script');

        script.src = url;
        script.async = true;

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        }
    }, [url]);
};

export default useScript;