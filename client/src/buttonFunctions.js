function completeTodo(socket, todo) {
    socket.emit("completeTodo", todo.id);
}

function deleteTodo(socket, todo) {
    socket.emit("deleteTodo", todo.id);
}

export {completeTodo, deleteTodo};