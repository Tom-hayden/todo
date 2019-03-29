const completeTodo = (socket, todo) => {
    socket.emit("completeTodo", todo.id);
}

const deleteTodo = (socket, todo) => {
    socket.emit("deleteTodo", todo.id);
}

const createTodo = (socket,todoText) => {
    socket.emit("create",{title: todoText});
}

const deleteCompletedTodos = (socket) => {
    socket.emit("deleteCompleted",);
}

export {completeTodo, deleteTodo, createTodo, deleteCompletedTodos};
