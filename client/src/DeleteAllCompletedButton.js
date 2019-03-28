import React from "react";
import {deleteCompletedTodos} from "./buttonFunctions";

//Note that Button is only rendered if there are completed items.
const DeleteAllCompletedButton = ({todos, socket}) => {
    if(containsCompleted(todos)) {
        return (
            <button onClick={() => deleteCompletedTodos(socket)} id={"del_completed"}>
                Delete completed items
            </button>
        )
    } else {
        return null;
    }
}

const containsCompleted = (todos) => {
    return todos.some((todo) => {
        return todo.isComplete;
    });
}

export default DeleteAllCompletedButton;

export {DeleteAllCompletedButton, containsCompleted}
