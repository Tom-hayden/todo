import React from "react";
import TodoListItem from "./TodoListItem";


const TodoList = ({todos, socket, filter}) => {

    const filteredTodoList = filter(todos);
    const listItems = filteredTodoList.map((todo) => <TodoListItem socket={socket} todo={todo} key={todo.id}/>);
    return (
        <ul id="todo-list">
            {listItems}
        </ul>
    )
}

export default TodoList;