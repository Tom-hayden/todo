import React from "react";
import TodoCounter from "./TodoCounter";
import FilterSelector from "./FilterSelector";

function TodoHeader({nTodos}) {
    return (
        <div>
            <h1>
                Todo List
            </h1>
            <FilterSelector />
            <TodoCounter nTodos={nTodos} />
        </div>
    );
}

export default TodoHeader;