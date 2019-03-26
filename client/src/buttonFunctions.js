function completeTodo(socket, todo) {
    socket.emit("completeTodo", todo.id);
}

function deleteTodo(socket, todo) {
    socket.emit("deleteTodo", todo.id);
}

function createTodo(socket,todoText) {
    socket.emit("create",{title: todoText});
}

export {completeTodo, deleteTodo, createTodo};