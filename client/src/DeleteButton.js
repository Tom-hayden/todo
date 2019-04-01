import React from "react";
import {deleteTodo} from "./buttonFunctions";
import PropTypes from "prop-types";
import {Button} from "semantic-ui-react";


const DeleteButton = ({todo, socket}) => {
    return (
        <Button onClick={() => deleteTodo(socket, todo)} id={"del_" + todo.id}>
            Delete
        </Button>
    )
}

DeleteButton.propTypes = {
    todo: PropTypes.object,
    socket: PropTypes.object
}

export default DeleteButton;
