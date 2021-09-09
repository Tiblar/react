import React, {useEffect, useState} from "react";
import axios from "axios";

import TimesIcon from "./assets/svg/icons/times.svg";

import versionStyles from "./css/components/version.css"
import formStyles from "./css/form.css"

function MonitorVersion() {

    const [manager, setManager] = useState({
        version: null,
        updateAvailable: false,
    });

    useEffect(() => {
        const interval = setInterval(checkVersion, 10 * 60 * 1000);

        return () => {
            clearInterval(interval);
        }
    }, [manager.version]);

    function checkVersion() {
        axios.get("/version")
            .then(res => {
                const version = res.data;

                if(manager.version === null){
                    setManager(manager => ({
                        ...manager,
                        version: version,
                    }));

                    return;
                }

                if(manager.version !== version){
                    setManager(manager => ({
                        ...manager,
                        version: version,
                        updateAvailable: true,
                    }));
                }
            })
            .catch(err => {

            });
    }

    function handleReload() {
        location.reload();
    }

    function handleRemove() {
        setManager(manager => ({
            ...manager,
            updateAvailable: false,
        }))
    }

    if(!manager.updateAvailable){
        return null;
    }

    return (
        <div className={versionStyles.container}>
            <TimesIcon height={16} width={16} onClick={handleRemove} />
            New version available.
            <button className={formStyles.button + ' ' + formStyles.buttonPrimary} onClick={handleReload}>Load</button>
        </div>
    )
}

export default MonitorVersion;