import React from "react";
import {completeTodo} from "./buttonFunctions";
import PropTypes from "prop-types";


const CompleteButton = ({todo, socket}) => {
    return (
        <button onClick={() => completeTodo(socket, todo)} id={"complete_" + todo.id}>
            Complete
        </button>
    )
}

CompleteButton.propTypes = {
    todo: PropTypes.object,
    socket: PropTypes.object
}

export default CompleteButton;
