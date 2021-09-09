// @flow

import React, {useEffect, useState} from "react";
import axios from "axios";

import {mT1} from "../../../../../../../../css/layout.css";
import postStyles from "../../../../../../../../css/components/post.css";

import LoadingIcon from "../../../../../../../../assets/loading/dots.svg";

import WaveformComponent from "../../../../../../../../util/components/WaveformComponent";
import {API_URL} from "../../../../../../../../util/constants";
import PlyrAudioComponent from "../../../../../../../../util/components/PlyrAudioComponent";

const Audio = (props) => {
    let [manager, setManager] = useState({
        wave: null,
        large: false,
        error: false,
    });

    useEffect(() => {
        if(props.file.file.file_size > 0.1){
            setManager(manager => ({
                ...manager,
                large: true,
            }))

            return;
        }

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        axios
            .get(API_URL + "/post/waveform/" + props.file.file.hash, config)
            .then(res => {
                setManager({
                    ...manager,
                    wave: res.data.data.wave
                });
            })
            .catch(err => {
                setManager({
                    ...manager,
                    error: true,
                });
            });

    }, [props.file.file.hash])

    return (
        <div className={postStyles.audio + ' ' + mT1}>
            {
                manager.wave !== null && manager.error !== true &&
                <WaveformComponent id={props.file.id} options={{
                    track: props.file.file.url,
                    wave: manager.wave
                }}/>
            }
            {
                manager.wave === null && manager.error !== true && !manager.large &&
                <div className={postStyles.loading}>
                    <LoadingIcon height={64} />
                </div>
            }
            {
                (manager.error === true || manager.large) &&
                <PlyrAudioComponent sources={{
                    type: 'audio',
                    sources: [
                        {
                            src: props.file.file.url,
                        },
                    ],
                }}/>
            }
        </div>
    );
};

export default Audio;
