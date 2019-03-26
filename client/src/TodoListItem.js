import React from "react";
import CompleteButton from './CompleteButton';
import DeleteButton from './DeleteButton';

function TodoListItem({todo, socket}) {
    return (
        <li id={"TodoListItem_" + todo.id}>
            <div>
                {todo.title}
            </div>
            <div>
                <DeleteButton todo={todo} socket={socket} />
            </div>
            {!todo.isComplete &&
                <CompleteButton todo={todo} socket={socket} />
            }
        </li>
    );
}

export default TodoListItem;