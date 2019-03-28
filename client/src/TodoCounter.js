import React from "react";
import todoFilters from "./todoListFilters";

function TodoCounter({todos}) {
    const uncompleteTodos = todoFilters.active(todos).length;
    return (
        <div id="count-label">
            Number of Todos: {uncompleteTodos}
        </div>
    );
}

export default TodoCounter;
