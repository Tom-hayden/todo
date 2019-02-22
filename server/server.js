var express = require("express");
var bodyParser = require("body-parser");
var _ = require("underscore");

module.exports = function(port, middleware, callback) {
    var app = express();

    if (middleware) {
        app.use(middleware);
    }
    app.use(express.static("public"));
    app.use(bodyParser.json());

    var latestId = 0;
    var todos = [];

    // Create
    app.post("/api/todo", function(req, res) {
        var id = addNewTodo(req.body);
        res.set("Location", "/api/todo/" + id);
        res.sendStatus(201);
    });

    // Read
    app.get("/api/todo", function(req, res) {
        res.json(todos);
    });

    // Delete
    app.delete("/api/todo/:id", function(req, res) {
        if (deleteTodo(req.params.id)) {
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    });

    //Update
    app.put("/api/todo/:id", function(req, res) {
        if (updateTodo(req.params.id, req.body)) {
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    });

    function deleteTodo(id) {
        var todo = getTodo(id);
        if (todo) {
            todos = todos.filter(function(otherTodo) {
                return otherTodo !== todo;
            });
            return true;
        } else {
            return false;
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
        return Object.assign({}, { id: id, isComplete: false}, todoBody);
    }

    function getTodo(id) {
        return _.find(todos, function(todo) {
            return todo.id === id;
        });
    }

    function replaceTodo(id, todoBody) {
        todos.forEach(function(todo, index, todosArray) {
            if (todo.id === id) {
                todosArray[index] = createTodo(todoBody, id);
            }
        });
        return todos;
    }

    function addNewTodo(todoBody) {
        var id = latestId.toString();
        todos.push(createTodo(todoBody, id));
        latestId++;
        return id;
    }

    var server = app.listen(port, callback);

    // We manually manage the connections to ensure that they're closed when calling close().
    var connections = [];
    server.on("connection", function(connection) {
        connections.push(connection);
    });

    return {
        close: function(callback) {
            connections.forEach(function(connection) {
                connection.destroy();
            });
            server.close(callback);
        }
    };
};
