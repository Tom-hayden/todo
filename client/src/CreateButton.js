import React from "react";

const CreateButton = (props) => {
    return (
        <button onClick={props.callback}>
            {props.text}
        </button>
    )
}

export default CreateButton;