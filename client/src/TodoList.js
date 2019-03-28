import React from "react";
import TodoListItem from "./TodoListItem";

const TodoList = ({todos, socket, filter}) => {

    let listItems = todos;
    if (filter === "all") {

    } else if (filter === "complete") {
        listItems = listItems.filter((todo) => todo.isComplete);
    } else if (filter === "active") {
        listItems = listItems.filter((todo) => !todo.isComplete);
    }

    return listItems.map((todo) => <TodoListItem socket={socket} todo={todo} key={todo.id}/>);
}

export default TodoList;