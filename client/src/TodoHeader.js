import React from "react";
import TodoCounter from "./TodoCounter";
import FilterSelector from "./FilterSelector";

function TodoHeader({todos, onFilterChange}) {
    return (
        <div>
            <h1>
                Todo List
            </h1>
            <FilterSelector onFilterChange={onFilterChange}/>
            <TodoCounter todos={todos} />
        </div>
    );
}

export default TodoHeader;