import React from "react";

function PrefetchIcons(props) {

    return (
        <>
            <img alt={"svg"} src={props.warning} width="24" height="23" style={{visibility: "hidden", position: "absolute", top: "0", left: "0"}}/>
            <img alt={"svg"} src={props.e2e_warning} width="24" height="23" style={{visibility: "hidden", position: "absolute", top: "0", left: "0"}}/>
            <img alt={"svg"} src={props.warning_triangle} width="24" height="23" style={{visibility: "hidden", position: "absolute", top: "0", left: "0"}}/>
            <img alt={"svg"} src={props.bold} width="25" height="22" style={{visibility: "hidden", position: "absolute", top: "0", left: "0"}}/>
            <img alt={"svg"} src={props.code} width="25" height="22" style={{visibility: "hidden", position: "absolute", top: "0", left: "0"}}/>
            <img alt={"svg"} src={props.italics} width="25" height="22" style={{visibility: "hidden", position: "absolute", top: "0", left: "0"}}/>
            <img alt={"svg"} src={props.quote} width="25" height="22" style={{visibility: "hidden", position: "absolute", top: "0", left: "0"}}/>
            <img alt={"svg"} src={props.strike_through} width="25" height="22" style={{visibility: "hidden", position: "absolute", top: "0", left: "0"}}/>
        </>
    );
}

export default PrefetchIcons;
