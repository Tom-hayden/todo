import React from "react";
import CreateButton from "./CreateButton";
import {deleteTodo} from "./buttonFunctions";


function DeleteButton({todo, socket}) {
    return (
        <CreateButton text="Delete" callback={()=>{
            deleteTodo(socket, todo)
        }} id={"del_" + todo.id}/>
    )
}

export default DeleteButton;