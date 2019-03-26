import React from "react";

function CreateButton(props) {
    return (
        <button onClick={props.callback}>
            {props.text}
        </button>
    )
}

export default CreateButton;