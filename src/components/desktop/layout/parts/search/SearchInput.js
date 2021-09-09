import React, {useState, useEffect, useRef} from "react";
import axios from "axios";
import { withRouter } from 'react-router-dom';
import PropTypes from "prop-types";

import SearchIcon from "../../../../../assets/svg/icons/search.svg";
import TimesIcon from "../../../../../assets/svg/icons/times.svg";

import searchStyles from "../../../../../css/components/search.css";
import navStyles from "../../../../../css/components/tabs-nav.css";

import {API_URL} from "../../../../../util/constants";
import history from "../../../../../util/history";
import layoutStyles from "../../../../../css/layout.css";

function SearchInput(props) {
    const inputRef = useRef();
    const _isMounted = useRef(true);

    const urlParams = new URLSearchParams(window.location.search);

    let input = "";

    if(urlParams.get('q') !== null){
        input = decodeURIComponent(urlParams.get('q'));
    }

    if(props.match.params.query !== undefined){
        input = decodeURIComponent(props.match.params.query);
    }

    const [manager, setManager] = useState({
        input: input,
        tags: [],
        titles: [],
        profiles: [],
        error: false,
    });

    useEffect(() => {
        return () => {
            _isMounted.current = false
        }
    }, []);

    useEffect(() => {
        const unlisten = history.listen(location =>  {
            if(props.match.params.query === undefined){
                handleHistory(location);
            }
        });

        return () => {
            unlisten();
        }
    });

    useEffect(() => {
        if(props.match.params.query !== undefined) {
            setManager(manager => ({
                ...manager,
                input: decodeURIComponent(props.match.params.query)
            }));
        }
    }, [props.match.params.query]);

    useEffect(() => {
        if(manager.input.length === 0){
            setManager(manager => ({
                ...manager,
                input: "",
                tag: [],
                titles: [],
                profiles: [],
            }));
            return;
        }

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            params: {
                query: manager.input
            }
        };

        let url = `${props.video ? 'video' : 'social'}${props.username !== null ? '/' + props.username : ''}`;
        axios.get(API_URL + `/search/${url}/complete`, config)
            .then(function (res) {
                let tags = res.data.data.tags;
                let titles = res.data.data.titles;
                let profiles = res.data.data.profiles;
                if(_isMounted.current && tags !== undefined && titles !== undefined && profiles !== undefined){
                    setManager(manager => ({
                        ...manager,
                        tags: tags,
                        titles: titles,
                        profiles: profiles,
                        error: false,
                    }));
                }
            })
            .catch(() => {
                if(_isMounted.current){
                    setManager(manager => ({
                        ...manager,
                        error: true,
                    }));
                }
            })

    }, [manager.input, props.search]);

    useEffect(() => {
        if(props.show){
            inputRef.current.focus();
        }
    }, [props.show]);

    function handleHistory(location) {
        const newParams = new URLSearchParams(location.search);

        if(newParams.get('q') !== null){
            setManager(manager => ({
                ...manager,
                input: newParams.get('q')
            }))
        }else{
            setManager(manager => ({
                ...manager,
                input: ""
            }))
        }
    }

    function handleSearch(e) {
        let value = e.target.value;

        setManager(manager => ({
            ...manager,
            input: value
        }));
    }

    function handleSubmit(e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();

            let query = encodeURIComponent(manager.input);

            if(manager.input.length === 0){
                return;
            }

            props.setShow(false)

            inputRef.current.blur();

            if(props.username){
                if(query !== null && query !== ""){
                    history.push(`${props.video ? '/channel' : ''}/${props.username}?q=` + query)
                }else{
                    history.push(`${props.video ? '/channel' : ''}/${props.username}`)
                }
            }else{
                history.push(`${props.video ? '/video' : ''}/search/` + query)
            }
        }
    }

    function handleTagClick(tag) {
        if(props.username){
            history.push(`${props.video ? '/channel' : ''}/${props.username}?q=` + tag)
        }else{
            history.push(`${props.video ? '/video' : ''}/search/` + encodeURIComponent(tag));
        }

        props.setShow(false)
    }

    function handleTitleClick(title) {
        if(props.username){
            history.push(`${props.video ? '/channel' : ''}/${props.username}?q=` + title)
        }else{
            history.push(`${props.video ? '/video' : ''}/search/` + encodeURIComponent(title));
        }

        props.setShow(false)
    }

    function handleProfileClick(profile) {
        history.push(`${props.video ? '/channel' : ''}/` + profile);

        props.setShow(false)
    }

    function handleClear() {
        if(props.username && urlParams.get('q') !== "" && urlParams.get('q') !== null){
            history.push(`${props.video ? '/channel' : ''}/${props.username}`)
        }
    }

    return (
        <div className={searchStyles.container}>
            <div className={searchStyles.search}>
                <div className={searchStyles.searchIcon}>
                    {
                        props.show &&
                        <TimesIcon
                            height={20}
                            width={20}
                            onClick={() => { handleClear(); props.setShow(false) }}
                            className={searchStyles.clearButton}
                        />
                    }
                    {
                        !props.show &&
                        <SearchIcon width={20} height={20} />
                    }
                </div>
                <input className={searchStyles.input}
                       ref={inputRef}
                       onFocus={() => { props.setShow(true) }}
                       onChange={handleSearch}
                       onKeyPress={handleSubmit}
                       value={manager.input}
                       placeholder="Search..." />
            </div>
            {
                props.show && props.autoComplete !== false &&
                <div className={searchStyles.searchComplete}>
                    {
                        props.profileNav &&
                        <div className={layoutStyles.flex}>
                            <div className={navStyles.nav + ' ' + layoutStyles.flexGrow}>
                                <div className={navStyles.pages}>
                                    <div onClick={() => { props.setSearch("PROFILE") }} className={navStyles.page}>
                                        <label>Profile</label>
                                        {
                                            props.search === "PROFILE" &&
                                            <span className={navStyles.active}/>
                                        }
                                    </div>
                                    <div onClick={() => { props.setSearch("EVERYTHING") }} className={navStyles.page}>
                                        <label>Everything</label>
                                        {
                                            props.search === "EVERYTHING" &&
                                            <span className={navStyles.active}/>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    <div className={searchStyles.section}>
                        <div className={searchStyles.title}>
                            Search
                        </div>
                        {manager.tags.map((tag) => (
                            <div key={tag.id} className={searchStyles.result}
                                 onClick={() => { handleTagClick(tag.title) }}>
                                {tag.title}
                            </div>
                        ))}
                        {manager.titles.map(title => (
                            <div key={title} className={searchStyles.result}
                                 onClick={() => { handleTitleClick(title) }}>
                                {title}
                            </div>
                        ))}
                        {
                            ((manager.tags.length === 0) && (manager.titles.length === 0)) &&
                            <div className={searchStyles.result}>
                                No results found
                            </div>
                        }
                    </div>
                    {
                        props.profiles &&
                        <div className={searchStyles.section}>
                            <div className={searchStyles.title}>
                                Profiles
                            </div>
                            {manager.profiles.slice(0, 3).map(profile => (
                                <div key={profile.id} className={searchStyles.result}
                                     onClick={() => { handleProfileClick(profile.info.username) }}>
                                    <img src={profile.info.avatar} alt={`${profile.info.username} avatar`} height={24} width={24}/>
                                    {profile.info.username}
                                </div>
                            ))}
                            {
                                manager.profiles.length === 0 &&
                                <div className={searchStyles.result}>
                                    No results found
                                </div>
                            }
                        </div>
                    }
                </div>
            }
        </div>
    );
}

SearchInput.propTypes = {
    show: PropTypes.bool,
    video: PropTypes.bool,
    setShow: PropTypes.func.isRequired,
    autoComplete: PropTypes.bool,
    profileNav: PropTypes.bool,
    search: PropTypes.string,
    setSearch: PropTypes.func,
    profiles: PropTypes.bool,
    username: PropTypes.string,
}

SearchInput.defaultProps = {
    show: false,
    video: false,
    autoComplete: true,
    profileNav: false,
    profiles: true,
    setSearch: (_) => {},
    search: null,
    username: null,
}

export default withRouter(SearchInput);
