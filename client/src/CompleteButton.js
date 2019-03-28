import React from "react";
import {completeTodo} from "./buttonFunctions";


const CompleteButton = ({todo, socket}) => {
    return (
        <button onClick={() => completeTodo(socket, todo)} id={"complete_" + todo.id}>
            Complete
        </button>
    )
}

export default CompleteButton;