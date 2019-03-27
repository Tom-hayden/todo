import React from "react";

function TodoCounter({todos}) {
    const uncompleteTodos = todos.filter(function(todo) {
        return todo.isComplete === false;
    }).length;
    return (
        <div id="count-label">
            Number of Todos: {uncompleteTodos}
        </div>
    );
}

export default TodoCounter;
