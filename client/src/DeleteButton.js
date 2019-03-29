import React from "react";
import {deleteTodo} from "./buttonFunctions";
import PropTypes from "prop-types";


const DeleteButton = ({todo, socket}) => {
    return (
        <button onClick={() => deleteTodo(socket, todo)} id={"del_" + todo.id}>
            Delete
        </button>
    )
}

DeleteButton.propTypes = {
    todo: PropTypes.object,
    socket: PropTypes.object
}

export default DeleteButton;
