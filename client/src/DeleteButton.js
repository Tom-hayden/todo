import React from "react";
import {deleteTodo} from "./buttonFunctions";


const DeleteButton = ({todo, socket}) => {
    return (
        <button onClick={() => deleteTodo(socket, todo)} id={"del_" + todo.id}>
            Delete
        </button>
    )
}

export default DeleteButton;