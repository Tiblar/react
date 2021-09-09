// @flow

import React, {useEffect, useState} from "react";
import axios from "axios";
import {connect} from "react-redux";

import postStyles from "../../../../../../../../css/components/post.css";

import LoadingIcon from "../../../../../../../../assets/loading/dots.svg";

import WaveformComponent from "../../../../../../../../util/components/WaveformComponent";
import {API_URL} from "../../../../../../../../util/constants";
import PlyrAudioComponent from "../../../../../../../../util/components/PlyrAudioComponent";

const Audio = (props) => {
    let [manager, setManager] = useState({
        wave: null,
        large: false,
    });

    useEffect(() => {
        if(props.file.file.size > 100000000){
            setManager(manager => ({
                ...manager,
                large: true,
            }));
            return;
        }


        const data = new FormData();
        data.append('file', props.file.file);

        axios
            .post(API_URL + "/post/waveform/file", data)
            .then(res => {
                setManager({
                    wave: res.data.data.wave
                });
            })
            .catch(err => {

            });

    }, [props.file.blob])

    return (
        <div className={postStyles.audio}>
            {
                manager.wave !== null &&
                <WaveformComponent id={props.file.id} options={{
                    track: props.file.blob,
                    wave: manager.wave
                }}/>
            }
            {
                manager.large &&
                <PlyrAudioComponent sources={{
                    type: 'audio',
                    sources: [
                        {
                            src: props.file.blob,
                        },
                    ],
                }}/>
            }
            {
                manager.wave === null && !manager.large &&
                <div className={postStyles.loading}>
                    <LoadingIcon height={64} />
                </div>
            }
        </div>
    );
};

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth };
};

export default connect(mapStateToProps)(Audio);
