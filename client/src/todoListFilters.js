
const todoFilters = {
    "all": (todos) => {
        return todos;
    },

    "complete": (todos) => {
        return todos.filter((todo) => todo.isComplete);
    },

    "active": (todos) => {
        return todos.filter((todo) => !todo.isComplete);
    }
}

export default todoFilters;