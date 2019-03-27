import React from "react";
import TodoCounter from "./TodoCounter";
import FilterSelector from "./FilterSelector";

const TodoHeader = ({numberOfTodos, onFilterChange}) => {
    return (
        <div>
            <h1>
                Todo List
            </h1>
            <FilterSelector onFilterChange={onFilterChange}/>
            <TodoCounter nTodos={numberOfTodos} />
        </div>
    );
}

export default TodoHeader;