import React from "react";
import {deleteCompletedTodos} from "./buttonFunctions";
import PropTypes from "prop-types";
import {Button} from "semantic-ui-react";

//Note that Button is only rendered if there are completed items.
const DeleteAllCompletedButton = ({todos, socket}) => {
    if (containsCompleted(todos)) {
        return (
            <Button negative onClick={() => deleteCompletedTodos(socket)} id={"del_completed"} floated="right"
                style={{"marginBottom": "5px","marginRight": "5px"}}>
                Delete completed items
            </Button>
        )
    } else {
        return null;
    }
}

DeleteAllCompletedButton.propTypes = {
    todo: PropTypes.array,
    socket: PropTypes.object
}

const containsCompleted = (todos) => {
    return todos.some((todo) => {
        return todo.isComplete;
    });
}

export default DeleteAllCompletedButton;

export {DeleteAllCompletedButton, containsCompleted}
