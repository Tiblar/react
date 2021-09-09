import React, {useEffect, useRef, useState} from "react";
import PropTypes from "prop-types";
import isMobile from "is-mobile";

import categoriesStyles from "../../../../../css/layout/video/categories.css";
import {button} from "../../../../../css/form.css";

import PreviousIcon from "../../../../../assets/svg/icons/chevronLeft.svg";
import NextIcon from "../../../../../assets/svg/icons/chevronRight.svg";

function Categories(props) {

    const containerRef = useRef();

    const [manager, setManager] = useState({
        scrollStart: true,
        scrollEnd: false,
    });

    useEffect(() => {
        import('smoothscroll-polyfill').then(module => module.polyfill());
    }, []);

    useEffect(() => {
        function handleScroll(e) {
            setManager(manager => ({
                ...manager,
                scrollStart: containerRef.current.scrollLeft === 0,
                scrollEnd: containerRef.current.scrollWidth - containerRef.current.scrollLeft === containerRef.current.offsetWidth,
            }))
        }

        if(containerRef && containerRef.current){
            containerRef.current.addEventListener('scroll', handleScroll);

            return () => {
                containerRef.current.removeEventListener('scroll', handleScroll);
            }
        }
    }, [containerRef.current]);

    function handlePrevious() {
        let pos = containerRef.current.scrollLeft;
        let width = containerRef.current.scrollWidth;

        let newPos = pos - (width * 0.15);

        let fraction = newPos/containerRef.current.scrollWidth;

        if(fraction < 0.2){
            newPos = 0;
        }

        containerRef.current.scroll({ left: newPos, behavior: 'smooth' });
    }

    function handleNext() {
        let pos = containerRef.current.scrollLeft;
        let width = containerRef.current.scrollWidth;

        let newPos = pos + (width * 0.10);

        let fraction = newPos/containerRef.current.scrollWidth;

        if(fraction > 0.8){
            newPos = containerRef.current.scrollWidth;
        }

        containerRef.current.scroll({ left: newPos, behavior: 'smooth' });
    }

    function handleUpdate(id) {
        let category = props.active.find(c => c.id === id);

        let categories = props.active;
        if(category){
            categories = categories.filter(c => c.id !== id);
        }else{
            categories.unshift({
                id,
                shownCount: 8,
            });
        }

        props.updateActiveCategories(categories);
    }

    return (
        <div className={categoriesStyles.container}>
            <div className={categoriesStyles.controls}>
                {
                    (!manager.scrollStart && props.categories.length > 0 && !isMobile()) &&
                    <div className={categoriesStyles.scrollAction + ' ' + categoriesStyles.previous}>
                        <button className={categoriesStyles.button} onClick={handlePrevious}>
                            <PreviousIcon height={24} width={15} />
                        </button>
                    </div>
                }
                <nav className={categoriesStyles.categories + (isMobile() ? ' ' + categoriesStyles.mobile : '')} ref={containerRef}>
                    {
                        props.categories.map(category => (
                            <div
                                key={category.id}
                                className={
                                    categoriesStyles.category +
                                    (props.active.find(c => c.id === category.id) ? ' ' + categoriesStyles.active : '')
                                }
                                onClick={() => { handleUpdate(category.id) }}
                            >
                                {category.title}
                            </div>
                        ))
                    }
                </nav>
                {
                    (!manager.scrollEnd && props.categories.length > 0 && !isMobile()) &&
                    <div className={categoriesStyles.scrollAction + ' ' + categoriesStyles.next}>
                        <button className={categoriesStyles.button} onClick={handleNext}>
                            <NextIcon height={24} width={15} />
                        </button>
                    </div>
                }
            </div>
        </div>
    )
}

Categories.propTypes = {
    active: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    updateActiveCategories: PropTypes.func.isRequired,
};

export default Categories;
