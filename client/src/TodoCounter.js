import React from "react";
import PropTypes from "prop-types";
import todoFilters from "./todoListFilters";

function TodoCounter({todos}) {
    const uncompleteTodos = todoFilters.active(todos).length;
    return (
        <div id="count-label">
            Number of Todos: {uncompleteTodos}
        </div>
    );
}

TodoCounter.propTypes = {
    todos: PropTypes.object
}

export default TodoCounter;
