import React from "react";
import CreateButton from "./CreateButton";
import {completeTodo} from "./buttonFunctions";


function CompleteButton({todo, socket}) {
    return (
        <CreateButton text="Complete" callback={()=>{
            completeTodo(socket, todo)
        }}/>
    )
}

export default CompleteButton;