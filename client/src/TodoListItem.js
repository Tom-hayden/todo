import React from "react";
import PropTypes from "prop-types";
import CompleteButton from "./CompleteButton";
import DeleteButton from "./DeleteButton";
import "./TodoListItem.css";
import {Button} from "semantic-ui-react";

const TodoListItem = ({todo, socket}) => {

    const todoElementClassName = todo.isComplete ? "completed" : "";

    const todoTextelement = (
        <div id={"todo_text_" + todo.id} className={todoElementClassName} style={{display: "inline",flexGrow:"1"}}>
            {todo.title}
        </div>
    )

    return (
        <li id={"TodoListItem_" + todo.id} style={{"display":"flex","flexDirection":"row"}}>
            {todoTextelement}
            <Button.Group style={{"marginRight":"5px", "marginLeft":"5px",}}>
                {!todo.isComplete &&
                    <CompleteButton todo={todo} socket={socket} />
                }
                <DeleteButton todo={todo} socket={socket} />
            </Button.Group>
          
        </li>
    );
}

TodoListItem.propTypes = {
    todo: PropTypes.object,
    socket: PropTypes.object
}

export default TodoListItem;
