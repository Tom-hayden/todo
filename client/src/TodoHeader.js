import React from "react";
import TodoCounter from "./TodoCounter";
import FilterSelector from "./FilterSelector";
import PropTypes from "prop-types";

const TodoHeader = ({todos, onFilterChange}) => {
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

TodoHeader.propTypes = {
    todos: PropTypes.array,
    onFilterChange: PropTypes.func
}

export default TodoHeader;
