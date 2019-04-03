import {completeTodo} from "./buttonFunctions.js";


it("Calls emit on socket", () => {
    let socket = {};
    let todo = {};
    const todoID = "3"

    socket["emit"] = jest.fn();
    todo.id = todoID;

    completeTodo(socket,todo);

    expect(socket.emit).toHaveBeenCalledWith("completeTodo",todoID);
})

