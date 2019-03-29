import React from "react";
import PropTypes from "prop-types";
import CompleteButton from "./CompleteButton";
import DeleteButton from "./DeleteButton";
import "./TodoListItem.css";

const TodoListItem = ({todo, socket}) => {

    const todoElementClassName = todo.isComplete ? "completed" : "";

    const todoTextelement = (
        <div id={"todo_text_" + todo.id} className={todoElementClassName}>
            {todo.title}
        </div>
    )

    return (
        <li id={"TodoListItem_" + todo.id}>
            {todoTextelement}
            <div>
                <DeleteButton todo={todo} socket={socket} />
            </div>
            {!todo.isComplete &&
                <CompleteButton todo={todo} socket={socket} />
            }
        </li>
    );
}

TodoListItem.propTypes = {
    todo: PropTypes.object,
    socket: PropTypes.func
}

export default TodoListItem;
