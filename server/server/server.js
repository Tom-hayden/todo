const express = require("express");
const bodyParser = require("body-parser");
const _ = require("underscore");
const socketio = require("socket.io");
const onFinished = require("on-finished");
const path = require("path");

module.exports = function (port, middleware, callback, publicPath) {
    const app = express();
    const router = express.Router();
    app.use(router)

    if (middleware) {
        app.use(middleware);
    }
    if (publicPath) {
        app.use(express.static(publicPath));
    } else {
        app.use(express.static(path.resolve(__dirname, "../../client/build")));
    }

    app.use(bodyParser.json());

    let latestId = 0;
    let todos = [];

    // Create
    app.post("/api/todo", function (req, res) {
        const id = addNewTodo(req.body);
        res.set("Location", "/api/todo/" + id);
        res.sendStatus(201);
    });

    // Read
    app.get("/api/todo", function (req, res) {
        res.json(todos);
    });

    // Delete
    app.delete("/api/todo/:id", function (req, res) {
        if (deleteTodo(req.params.id)) {
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    });

    //Update
    app.put("/api/todo/:id", function (req, res) {
        if (updateTodo(req.params.id, req.body)) {
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    });

    router.use("/api/*", function (req, res, next) {
        onFinished(res, function (err, res) {
            const reqMethod = req.method;
            if (reqMethod === "PUT" || reqMethod === "DELETE" || reqMethod === "POST") {
                if (res.statusCode === 200 || res.statusCode === 201) {
                    emitChanges();
                }
            }
        });
        next();
    });


    function deleteTodo(id) {
        const todo = getTodo(id);
        if (!todo) {
            return false;
        }
        todos = todos.filter(function (todoToDelete) {
            return todoToDelete !== todo;
        });
        return true;
    }

    function deleteTodoSocketIOWrapper(id) {
        if (!deleteTodo(id)) {
            throw "Todo ID does not refer to an existing todo item";
        }
    }

    function updateTodo(id, todoBody) {
        if (getTodo(id)) {
            replaceTodo(id, todoBody);
            return true;
        } else {
            return false;
        }
    }

    function createTodo(todoBody, id) {
        return Object.assign({}, { id: id, isComplete: false }, todoBody);
    }

    function getTodo(id) {
        return _.find(todos, function (todo) {
            return todo.id === id;
        });
    }

    function replaceTodo(id, todoBody) {
        todos.forEach(function (todo, index, todosArray) {
            if (todo.id === id) {
                todosArray[index] = createTodo(todoBody, id);
            }
        });
        return todos;
    }

    function addNewTodo(todoBody) {
        const id = latestId.toString();
        todos.push(createTodo(todoBody, id));
        latestId++;
        return id;
    }

    function completeTodo(id) {
        let todo = getTodo(id);
        if (!todo) {
            throw "Todo ID does not refer to an existing todo item";
        }
        if (todo.isComplete !== false) {
            throw "Todo item is already complete";
        }
        todo.isComplete = true;
        replaceTodo(id, todo);
    }

    function deleteAllCompleted() {
        const todosToDelete = returnCompletedTodos();
        deleteTodos(todosToDelete);
    }

    function returnCompletedTodos() {
        return todos.filter((todo) => todo.isComplete);
    }

    function deleteTodos(todos) {
        todos.forEach((todo) => {
            deleteTodo(todo.id);
        })
    }

    function emitChanges() {
        io.emit("todos", todos);
    }

    const server = app.listen(port, callback);
    const io = socketio.listen(server);
    // We manually manage the connections to ensure that they're closed when calling close().
    let connections = [];
    server.on("connection", function (connection) {
        connections.push(connection);
    });

    io.on("connection", function (socket) {
        socket.emit("todos", todos);
        socket.on("create", function (todo) {
            socketErrorHandler(socket, function () {
                addNewTodo(todo);
            });
            emitChanges();
        });
        socket.on("deleteTodo", function (id) {
            socketErrorHandler(socket, function () {
                deleteTodoSocketIOWrapper(id);
            });
            emitChanges();
        });
        socket.on("completeTodo", function (id) {
            socketErrorHandler(socket, function () {
                completeTodo(id)
            });
            emitChanges();
        });
        socket.on("deleteCompleted", function() {
            socketErrorHandler(socket, function() {
                deleteAllCompleted();
            })
            emitChanges();
        })
        socket.on("error", (error) => {
            socket.emit("serverError", generateErrorMessage(error));
        })
    });

    function generateErrorMessage(error) {
        return error.toString();
    }

    function socketErrorHandler(socket, fn) {
        try {
            fn();
        } catch (e) {
            socket.emit("error", e);
        }
    }

    return {
        close: function (callback) {
            connections.forEach(function (connection) {
                connection.destroy();
            });
            server.close(callback);
        }
    };
};
