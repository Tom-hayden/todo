import React from "react";
import TodoListItem from "./TodoListItem";
import PropTypes from "prop-types";


const TodoList = ({todos, socket, filter}) => {

    const filteredTodoList = filter(todos);
    const listItems = filteredTodoList.map((todo) => <TodoListItem socket={socket} todo={todo} key={todo.id}/>);
    return (
        <ul id="todo-list">
            {listItems}
        </ul>
    )
}

TodoList.propTypes = {
    todos: PropTypes.object,
    socket: PropTypes.object,
    filter: PropTypes.func
}

export default TodoList;
