import React from "react";
import CreateButton from "./CreateButton";
import {deleteTodo} from "./buttonFunctions";

//Note that Button is only rendered if there are completed items.
function DeleteAllCompletedButton({todos, socket}) {
    if(containsCompleted(todos)) {
        return (
            <CreateButton text="Delete Completed Items" callback={()=>{
                deleteCompletedTodos(socket, todos)
            }}/>
        )
    } else {
        return null;
    }
}

function containsCompleted(todos) {
    return todos.some((todo) => {
        return todo.isComplete;
    });
}

function deleteCompletedTodos(socket, todos) {
    let todosToDelete = getCompletedTodos(todos);
    todosToDelete.forEach((todo) => {
        deleteTodo(socket, todo);
    });
}

function getCompletedTodos(todos) {
    return todos.filter((todo) => {
        return todo.isComplete === true;
    });
}

export default DeleteAllCompletedButton;

export {getCompletedTodos, deleteCompletedTodos, DeleteAllCompletedButton, containsCompleted}
