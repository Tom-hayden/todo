import React from "react";

function CreateButton(props) {
    return (
        <button onClick={props.callback} id={props.id}>
            {props.text}
        </button>
    )
}

export default CreateButton;