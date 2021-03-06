const server = require("../server/server");
const request = require("request");
const assert = require("chai").assert;
const io = require("socket.io-client");

const testPort = 52684;
const baseUrl = "http://localhost:" + testPort;
const todoListUrl = baseUrl + "/api/todo";

describe("server", function() {
    let serverInstance;
    beforeEach(function() {
        serverInstance = server(testPort);
    });
    afterEach(function() {
        serverInstance.close();
    });
    describe("get list of todos", function() {
        it("responds with status code 200", function(done) {
            request(todoListUrl, function(error, response) {
                assert.equal(response.statusCode, 200);
                done();
            });
        });
        it("responds with a body encoded as JSON in UTF-8", function(done) {
            request(todoListUrl, function(error, response) {
                assert.equal(response.headers["content-type"], "application/json; charset=utf-8");
                done();
            });
        });
        it("responds with a body that is a JSON empty array", function(done) {
            request(todoListUrl, function(error, response, body) {
                assert.equal(body, "[]");
                done();
            });
        });
    });
    describe("create a new todo", function() {
        it("responds with status code 201", function(done) {
            request.post({
                url: todoListUrl,
                json: {
                    title: "This is a TODO item",
                    done: false
                }
            }, function(error, response) {
                assert.equal(response.statusCode, 201);
                done();
            });
        });
        it("responds with the location of the newly added resource", function(done) {
            request.post({
                url: todoListUrl,
                json: {
                    title: "This is a TODO item",
                    done: false
                }
            }, function(error, response) {
                assert.equal(response.headers.location, "/api/todo/0");
                done();
            });
        });
        it("inserts the todo at the end of the list of todos", function(done) {
            request.post({
                url: todoListUrl,
                json: {
                    title: "This is a TODO item",
                    done: false
                }
            }, function() {
                request.get(todoListUrl, function(error, response, body) {
                    assert.deepEqual(JSON.parse(body), [{
                        title: "This is a TODO item",
                        done: false,
                        id: "0",
                        isComplete: false
                    }]);
                    done();
                });
            });
        });
    });
    describe("delete a todo", function() {
        it("responds with status code 404 if there is no such item", function(done) {
            request.del(todoListUrl + "/0", function(error, response) {
                assert.equal(response.statusCode, 404);
                done();
            });
        });
        it("responds with status code 200", function(done) {
            request.post({
                url: todoListUrl,
                json: {
                    title: "This is a TODO item",
                    done: false
                }
            }, function() {
                request.del(todoListUrl + "/0", function(error, response) {
                    assert.equal(response.statusCode, 200);
                    done();
                });
            });
        });
        it("removes the item from the list of todos", function(done) {
            request.post({
                url: todoListUrl,
                json: {
                    title: "This is a TODO item",
                    done: false
                }
            }, function() {
                request.del(todoListUrl + "/0", function() {
                    request.get(todoListUrl, function(error, response, body) {
                        assert.deepEqual(JSON.parse(body), []);
                        done();
                    });
                });
            });
        });
    });
    describe("update a todo", function() {
        it("responds with status code 404 if there is no such item", function(done) {
            request.put({
                url: todoListUrl + "/0",
                json: {
                    title: "This is a TODO item",
                    done: false
                }
            }, function(error, response) {
                assert.equal(response.statusCode, 404);
                done();
            });

        });
        it("Responds with status code 200", function(done) {
            request.post({
                url: todoListUrl,
                json: {
                    title: "This is a TODO item",
                    done: false
                }
            }, function() {
                request.put({
                    url: todoListUrl + "/0",
                    json: {
                        title: "This is an altered TODO item",
                        done: false,
                    }
                }, function(error, response) {
                    assert.equal(response.statusCode, 200);
                    done();
                });
            });
        });
        it("Changes todo text", function(done) {
            request.post({
                url: todoListUrl,
                json: {
                    title: "This is a TODO item",
                    done: false
                }
            },  function () {
                request.post({
                    url: todoListUrl,
                    json: {
                        title: "This is a second TODO item",
                        done: false
                    }
                }, function() {
                    request.put({
                        url: todoListUrl + "/0",
                        json: {
                            title: "This is an altered TODO item",
                            done: false
                        }
                    }, function() {
                        request.get(todoListUrl, function(error, response, body) {
                            assert.deepEqual(JSON.parse(body)[0], {
                                title: "This is an altered TODO item",
                                done: false,
                                id: "0",
                                isComplete: false
                            });
                            done();
                        });
                    });
                });
            });
        });
    });
    describe("Socket functionality", function() {
        let socket = io(baseUrl);

        beforeEach(function() {
            socket.open();
        });
        afterEach(function() {
            socket.close();
        });
        it("Can add todo", function(done) {
            let todo = {
                "id": "0",
                "isComplete": false,
                "title": "Test item"
            }
            socket.on("todos", function(data) {
                if (data.length > 0) {
                    assert.deepEqual(data[0], todo);
                    socket.off();
                    done();
                }
            });
            socket.emit("create", {title: todo.title});
        });

        it("Can update todo", function(done) {
            let todo = {
                "id": "0",
                "isComplete": false,
                "title": "Test item"
            }
            socket.once("todos", function() {
                socket.once("todos", function() {
                    socket.once("todos", function(data) {
                        assert.equal(data[0].isComplete, true);
                        done();
                    });
                    socket.emit("completeTodo", todo.id);
                });
                socket.emit("create", {title: todo.title});
            });
        });
    })
});
