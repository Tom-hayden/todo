import React from "react";
import {completeTodo} from "./buttonFunctions";
import PropTypes from "prop-types";
import {Button} from "semantic-ui-react";


const CompleteButton = ({todo, socket}) => {
    return (
        <Button compact onClick={() => completeTodo(socket, todo)} id={"complete_" + todo.id}>
            Complete
        </Button>
    )
}

CompleteButton.propTypes = {
    todo: PropTypes.object,
    socket: PropTypes.object
}

export default CompleteButton;
