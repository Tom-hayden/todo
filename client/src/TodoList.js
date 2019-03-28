import React from "react";
import TodoListItem from "./TodoListItem";


const TodoList = ({todos, socket, filter}) => {

    let listItems = filter(todos);
    
    return listItems.map((todo) => <TodoListItem socket={socket} todo={todo} key={todo.id}/>);
}

export default TodoList;