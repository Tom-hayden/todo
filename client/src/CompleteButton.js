import React from "react";
import {completeTodo} from "./buttonFunctions";


const CompleteButton = ({todo, socket}) => {
    return (
        <button onClick={() => completeTodo(socket, todo)}>
            Complete
        </button>
    )
}

export default CompleteButton;