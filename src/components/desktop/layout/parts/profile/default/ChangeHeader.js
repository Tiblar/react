// @flow

import React, {useEffect, useState, useRef} from "react";
import "croppie/croppie.css";
import {toast} from "react-toastify";
import {connect} from "react-redux";
import {isMobile} from "is-mobile";

import layoutStyles, {hide, mL} from "../../../../../../css/layout.css";
import formStyles, {input} from "../../../../../../css/form.css";
import profileStyles from "../../../../../../css/layout/social/profile.css";
import modalStyles from "../../../../../../css/components/modal.css";

import CircleLoading from "../../../../../../assets/loading/circle-loading.svg";
import CameraIcon from "../../../../../../assets/svg/icons/camera.svg";
import TimesIcon from "../../../../../../assets/svg/icons/times.svg";

import ConfirmModal from "../../ConfirmModal";

import {imageToDimensions, toBase64, urlToFile} from "../../../../../../util/fileMutator";
import axios from "axios";
import {API_URL} from "../../../../../../util/constants";
import store from "../../../../../../store";
import {loadUser} from "../../../../../../reducers/auth/actions";

function ChangeHeader(props) {
    const bannerRef = useRef();

    const [manager, setManager] = useState({
        croppie: null,
        bannerModal: false,
        savingBanner: false,
        bannerBase64: null,
        confirmDelete: false,
    });

    useEffect(() => {
       async function load() {
           if(manager.bannerBase64 !== null && manager.croppie === null){
               const Croppie = (await import("croppie")).default;

               let croppie = new Croppie(document.getElementById('croppie'), {
                   viewport: { width: 350, height: 100 },
                   boundary: { width: 360, height: 320 },
                   enforceBoundary: true,
               });

               setManager({
                   ...manager,
                   croppie: croppie,
               });
           }
       }

       load();
    }, [manager.bannerBase64]);

    async function handleBanner() {
        let files = bannerRef.current.files;

        if(files.length === 0){
            return;
        }

        let {width, height} = await imageToDimensions(files[0]);

        if(width < 700 || height < 200){
            error("Image must be at least 700x200");
            return;
        }

        let base64 = await toBase64(files[0]);

        setManager({
            ...manager,
            bannerModal: true,
            bannerBase64: base64,
        });
    }

    function closeBanner() {
        if(manager.savingBanner){
            return;
        }

        manager.croppie.destroy();

        setManager({
            ...manager,
            bannerModal: false,
            croppie: null,
        });
    }

    async function saveBanner() {
        if(manager.savingBanner){
            return;
        }

        setManager({ ...manager, savingBanner: true });

        let file = null;

        if(manager.croppie){
            let image = await manager.croppie.result({
                type: "canvas",
                size: {
                    width: 700,
                    height: 200,
                },
                format: "png",
                quality: 1
            });

            file = await urlToFile(image, 'banner.png', 'image/png')
        }

        const config = {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        };

        const data = new FormData();

        data.append('file', file);

        axios
            .post(API_URL + "/users/@me/settings/banner", data, config)
            .then(res => {
                store.dispatch(loadUser());

                const Notification = () => (
                    <div>
                        Your banner has been saved!
                    </div>
                );

                setTimeout(() => {

                    toast(<Notification />, {
                        position: "bottom-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }, 800);

                setManager(manager => ({ ...manager, savingBanner: false, bannerModal: false, confirmDelete: false, croppie: null }));
            })
            .catch(err => {
                setManager(manager => ({ ...manager, savingBanner: false, croppie: null }));
                error("There was an error!");
            });

        setManager(manager => ({ ...manager, confirmDelete: false }));
    }

    function error(text) {
        const Notification = () => (
            <div>
                {text}
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
        }, 100);
    }

    return (
        <div className={profileStyles.editHeader}>
            {
                manager.confirmDelete &&
                <ConfirmModal header="Delete banner" body="Do you wish to delete your banner? Please confirm"
                              cancel={() => { setManager(manager => ({ ...manager, confirmDelete: false })) }}
                              callback={saveBanner} />
            }
            {
                manager.bannerModal &&
                <div className={modalStyles.containerOuter + (isMobile() ? (" " + modalStyles.mobile) : "")}>
                    <div className={modalStyles.wrapper}>
                        <div className={modalStyles.containerInner}>
                            <div className={modalStyles.modalContainer}>
                                <div className={modalStyles.modal}>
                                    <div className={modalStyles.top}>
                                        <div className={modalStyles.header}>
                                            <h3>New Banner</h3>
                                        </div>
                                    </div>
                                    <div className={modalStyles.body}>
                                        <img
                                            alt="croppie"
                                            id="croppie"
                                            src={manager.bannerBase64} />
                                    </div>
                                    <div className={modalStyles.footer}>
                                        <button className={formStyles.button} disabled={manager.savingBanner} onClick={closeBanner}>Close</button>
                                        <button className={formStyles.button + ' ' + formStyles.buttonPrimary + ' ' + formStyles.buttonIcon + ' ' + mL} onClick={saveBanner}>
                                            {
                                                !manager.savingBanner && "Save"
                                            }
                                            {
                                                manager.savingBanner && <CircleLoading height={16} width={16} />
                                            }
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
            <input
                type="file"
                accept=".png,.jpeg,.jpg"
                onChange={handleBanner}
                ref={bannerRef}
                className={hide} />
            <div className={formStyles.buttonGroup}>
                <button className={formStyles.button} onClick={() => { bannerRef.current.click() }}>
                    <CameraIcon height="16" width="16"/> Change
                </button>
                {
                    props.auth.user.info.banner !== null &&
                    <button className={formStyles.button + ' ' + formStyles.buttonIcon} onClick={() => { setManager({ ...manager, confirmDelete: true }) }}>
                        <TimesIcon height="16" width="16"/>
                    </button>
                }
            </div>
       </div>
    );
}

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth };
};

export default connect(mapStateToProps)(ChangeHeader);
