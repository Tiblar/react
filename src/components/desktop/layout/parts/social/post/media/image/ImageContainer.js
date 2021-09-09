// @flow

import React, {useState, useEffect, useRef, useCallback} from "react";
import {isMobile} from "is-mobile";

import postStyles from "../../../../../../../../css/components/post.css";
import {hide} from "../../../../../../../../css/layout.css";
import modalStyles from "../../../../../../../../css/components/modal.css";
import slideStyles from "../../../../../../../../css/components/slide.css";
import formStyles from "../../../../../../../../css/form.css";
import layoutStyles from "../../../../../../../../css/layout.css";

import CircleLoading from "../../../../../../../../assets/loading/circle-loading.svg";
import LeftArrowIcon from "../../../../../../../../assets/svg/icons/arrowLeft.svg";
import RightArrowIcon from "../../../../../../../../assets/svg/icons/arrowRight.svg";
import TimesIcon from "../../../../../../../../assets/svg/icons/times.svg";

import Image from "./Image";
import Row from "./Row";
import useWindowDimensions from "../../../../../../../../util/hooks/useWindowDimensions";

const ImageContainer = (props) => {
    const {height, width} = useWindowDimensions();

    const centerRef = useRef();
    const leftRef = useRef();
    const rightRef = useRef();

    const [manager, setManager] = useState({
        slideshow: false,
        currentImage: null,
        loaded: false,
        imageLeft: false,
        imageCenter: false,
        imageRight: false,
        expanded: false,
    });

    let lastRowNumber = 0;
    let rows = []

    let files = props.files.sort((a, b) => a.row - b.row);

    files.forEach(file => {
        if(rows.length === 0){
            rows.push({
                id: 0,
                images: []
            });
        }

        if(file.row === lastRowNumber) {
            rows[rows.length - 1].images.push(file)
        }else{
            rows.push({
                id: file.row,
                images: [
                    file
                ]
            });

            lastRowNumber++;
        }
    });

    function handleExpandImages() {
        setManager(manager => ({
            ...manager,
            expanded: true,
        }));
    }

    useEffect(() => {
        if(manager.slideshow){

            if(centerRef.current){
                centerRef.current.style.maxHeight = window.innerHeight*0.8 + "px";
                centerRef.current.style.position = 'absolute';
            }

            if(leftRef.current){
                leftRef.current.style.maxHeight = window.innerHeight*0.8 + "px";
                leftRef.current.style.position = 'absolute';
            }

            if(rightRef.current){
                rightRef.current.style.maxHeight = window.innerHeight*0.8 + "px";
                rightRef.current.style.position = 'absolute';
            }

        }
    }, [manager.slideshow, height])

    const arrowHandler = useCallback((e) =>  {
        if (e.repeat) { return }

        e.preventDefault();
        e.stopPropagation();

        if (e.key === "ArrowDown") {
            setManager(manager => ({
                ...manager,
                slideshow: false,
                currentImage: null,
            }));
        }

        if (e.key === "ArrowLeft") {
            setManager(manager => {
                setSlide(manager.currentImage - 1);
                return manager;
            });
        }

        if (e.key === "ArrowRight") {
            setManager(manager => {
                setSlide(manager.currentImage + 1);
                return manager;
            });
        }
    });

    useEffect(() => {
        if(manager.slideshow === true){
            window.addEventListener("keydown", arrowHandler)
        }

        return () => {
            window.removeEventListener("keydown", arrowHandler);
        }
    }, [manager.slideshow]);

    function setSlide(slide) {
        if(files.length === 1 && manager.slideshow){
            return;
        }

        if(slide >= files.length){
            slide = 0;
        }

        if(slide < 0) {
            slide = files.length - 1;
        }

        setManager(manager => ({
            ...manager,
            currentImage: slide,
            slideshow: true,
        }))
    }

    function close() {
        setManager({
            ...manager,
            slideshow: false,
        })
    }

    function outsideClick(e) {
        if(width <= 800){
            return;
        }

        if(e.target.tagName.toUpperCase() !== 'IMG'){
            close();
        }
    }

    let lastPos = 0;

    return (
        <div className={postStyles.rows}>
            {
                manager.slideshow &&
                <div className={modalStyles.containerOuter + (isMobile() ? (" " + modalStyles.mobile) : "")} onClick={outsideClick}>
                    {
                        files[manager.currentImage - 1] !== undefined &&
                        width > 800 &&
                        <img src={files[manager.currentImage - 1].file.url}
                             ref={leftRef}
                             className={slideStyles.slide + ' ' + slideStyles.leftSlide}
                             onClick={() => { setSlide(manager.currentImage - 1) }}
                             onLoad={() => { setManager({ ...manager, imageLeft: true }) }}
                              alt={""}/>
                    }
                    {
                        files[manager.currentImage - 1] !== undefined && !manager.imageLeft && width > 800 &&
                        <CircleLoading className={slideStyles.loading + ' ' + slideStyles.leftLoading} width={35}/>
                    }
                    <img src={files[manager.currentImage].file.url}
                         ref={centerRef}
                         className={slideStyles.slide + ' ' + slideStyles.centerSlide + ' ' + (!manager.imageCenter ? hide : '')}
                         onClick={() => { setSlide(manager.currentImage + 1) }}
                         onLoad={() => { setManager({ ...manager, imageCenter: true }) }}
                         alt={""}/>
                    {
                        !manager.imageCenter && <CircleLoading className={slideStyles.loading + ' ' + slideStyles.centerLoading} width={35}/>
                    }
                    {
                        files[manager.currentImage + 1] !== undefined &&
                        width > 800 &&
                        <img src={files[manager.currentImage + 1].file.url}
                             ref={rightRef}
                             className={slideStyles.slide + ' ' + slideStyles.rightSlide}
                             onClick={() => { setSlide(manager.currentImage + 1) }}
                             onLoad={() => { setManager({ ...manager, imageRight: true }) }}
                             alt={""}/>
                    }
                    {
                        files[manager.currentImage + 1] !== undefined &&  !manager.imageRight && width > 800 &&
                        <CircleLoading className={slideStyles.loading + ' ' + slideStyles.rightLoading} width={35}/>
                    }
                    {
                        width <= 800 &&
                        <div className={slideStyles.mobileNav}>
                            <div className={slideStyles.top}>
                                <button className={formStyles.button + ' ' + formStyles.buttonIcon} onClick={close}>
                                    <TimesIcon width={35} height={35} />
                                </button>
                            </div>
                            <div className={slideStyles.buttons}>
                                <button className={formStyles.button + ' ' + formStyles.buttonIcon} onClick={() => { setSlide(manager.currentImage - 1) }}>
                                    <LeftArrowIcon width={31} height={35} />
                                </button>
                                <button className={formStyles.button + ' ' + layoutStyles.mL} onClick={() => { setSlide(manager.currentImage + 1) }}>
                                    <RightArrowIcon width={31} height={35} />
                                </button>
                            </div>
                        </div>
                    }
                </div>
            }
            {rows.map((row, i) => {

                let minImage = row.images.reduce(function(res, obj) {
                    return ((obj.file.height/obj.file.width) < (res.file.height/res.file.width)) ? obj : res;
                });

                let minHeight = props.containerWidth !== null
                    ? (minImage.file.height / minImage.file.width) * (props.containerWidth/row.images.length)
                    : minImage.file.height;

                if(i > 1 && !manager.expanded){
                    return null;
                }

                return (
                    <Row key={row.id} row={row} last={i === (rows.length-1) || (i === 1 && !manager.expanded)}>
                        {row.images.map((file) => (
                            <Image key={file.id}
                                   image={file}
                                   pos={(lastPos++)}
                                   setSlide={setSlide}
                                   rowCount={row.images.length}
                                   height={minHeight} />
                        ))}
                    </Row>
                )
            })}
            {
                !manager.expanded && rows.length > 1 &&
                <div className={postStyles.expandImagesContainer}>
                    <div className={postStyles.expandImages}>
                        <button onClick={handleExpandImages} className={formStyles.button + ' ' + layoutStyles.flexGrow}>
                            Show All Images
                        </button>
                    </div>
                </div>
            }
        </div>
    );
};

export default ImageContainer;
