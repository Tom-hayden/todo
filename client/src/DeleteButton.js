import React from "react";
import CreateButton from "./CreateButton";
import {deleteTodo} from "./buttonFunctions";


const DeleteButton = ({todo, socket}) => {
    return (
        <CreateButton text="Delete" callback={()=>{
            deleteTodo(socket, todo)
        }}/>
    )
}

export default DeleteButton;