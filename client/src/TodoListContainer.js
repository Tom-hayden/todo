import React from "react";
import PropTypes from "prop-types";
import LoadingPage from "./LoadingPage";
import TodoList from "./TodoList";
import DeleteAllCompletedButton from "./DeleteAllCompletedButton";

const TodoListContainer = ({todos, socket, filter, hasRecievedData}) =>{

    let todoList;
    if (hasRecievedData) {
        todoList = (
            <div id="todo-list-container">
                <TodoList todos={todos} socket={socket} filter={filter}/>
                <DeleteAllCompletedButton todos={todos} socket={socket} />
            </div>
        );
    } else {
        todoList = (
            <div>
                <LoadingPage />
            </div>
        )
    }
    return todoList;
}

TodoList.propTypes = {
    todos: PropTypes.array,
    socket: PropTypes.object,
    filter: PropTypes.func,
    hasRecievedData: PropTypes.bool
}

export default TodoListContainer;
