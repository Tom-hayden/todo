import React from "react";
import TodoListItem from "./TodoListItem";

const TodoList = ({todos, socket, filter}) => {
    const listItems = todos.map((todo) => {
        if (filter === "all") {
            return <TodoListItem socket={socket} todo={todo} key={todo.id} />
        } else if (filter === "complete") {
            if (todo.isComplete) {
                return <TodoListItem socket={socket} todo={todo} key={todo.id} />
            } else {
                return null;
            }
        } else if (filter === "active") {
            if (!todo.isComplete) {
                return <TodoListItem socket={socket} todo={todo} key={todo.id} />
            } else {
                return null;
            }
        } else {
            console.log("This should not happen");
            return null;
        }
    })
    return listItems;
}

export default TodoList;