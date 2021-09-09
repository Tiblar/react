// @flow

import React, {useState} from "react";

import {button, buttonIcon, input} from "../../../../../../../../css/form.css";
import postModalStyles from "../../../../../../../../css/layout/social/post-modal.css";

import PlusIcon from "../../../../../../../../assets/svg/icons/plus.svg";
import TimesIcon from "../../../../../../../../assets/svg/icons/times.svg";
import {useManageActions, useManageState} from "../../context";

const Poll = (props) => {
    const { poll } = useManageState();
    const actions = useManageActions();

    let [manager, setManager] = useState({
        count: 0,
        showAdd: true,
    });

    function addOption() {
        let {count} = manager;

        if(count === 1){
            setManager({
                ...manager,
                showAdd: false,
                count: 2,
            });

            return;
        }

        count += 1;

        setManager({
            ...manager,
            count: count,
        });
    }

    function removeOption(option) {
        let {count} = manager;

        actions.setOption(option, "");

        count -= 1;

        setManager({
            ...manager,
            showAdd: true,
            count: count,
        });
    }

    function handleQuestion(e) {
        actions.setQuestion(e.target.value);
    }

    const handleOption = (option) => (e) => {
        actions.setOption(option, e.target.value);
    }

    let options = [];
    for (let i = 0;i<manager.count;i++) {
        let count = i === 0 ? "three" : "four";

        options.push(
            <div key={i} className={postModalStyles.option}>
                <input className={input}
                       onChange={handleOption(i + 3)}
                       placeholder={`Option ${count}`}
                       value={poll.options[i + 3]}
                       maxLength={80} />
                <button className={button + ' ' + buttonIcon} onClick={() => {removeOption(i)}}><TimesIcon width={15}/></button>
            </div>
        );
    }

    return (
        <div className={postModalStyles.poll}>
            <div className={postModalStyles.question}>
                <input className={input}
                       value={poll.question}
                       onChange={handleQuestion}
                       maxLength={120}
                       placeholder="Your question" />
            </div>
            <div className={postModalStyles.option}>
                <input className={input}
                       onChange={handleOption(1)}
                       value={poll.options[1]}
                       maxLength={80}
                       placeholder="Option one" />
            </div>
            <div className={postModalStyles.option}>
                <input  className={input}
                        onChange={handleOption(2)}
                        value={poll.options[2]}
                        maxLength={80}
                        placeholder="Option two" />
            </div>
            {options}
            {
                manager.showAdd &&
                <div className={postModalStyles.addOption}>
                    <button className={button + ' ' + buttonIcon} onClick={addOption}><PlusIcon width={15} /></button>
                </div>
            }
        </div>
    );
};

export default Poll;
