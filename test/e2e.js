const testing = require("selenium-webdriver/testing");
const assert = require("chai").assert;
const helpers = require("./e2eHelpers");

testing.describe("end to end", function() {
    this.timeout(20000);
    testing.before(helpers.setupDriver);
    testing.beforeEach(helpers.setupServer);
    testing.afterEach(helpers.teardownServer);
    testing.after(function() {
        helpers.teardownDriver();
        helpers.reportCoverage();
    });

    testing.describe("on page load", function() {
        testing.it("displays TODO title", function() {
            helpers.navigateToSite();
            helpers.getTitleText().then(function(text) {
                assert.equal(text, "TODO List");
            });
        });
        testing.it("displays empty TODO list", function() {
            helpers.navigateToSite();
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 0);
            });
        });
        testing.it("displays an error if the request fails", function() {
            helpers.setupErrorRoute("get", "/api/todo");
            helpers.navigateToSite();
            helpers.getErrorText().then(function(text) {
                assert.equal(text, "Failed to get list. Server returned 500 - Internal Server Error");
            });
        });
    });
    testing.describe("on create todo item", function() {
        testing.it("clears the input field", function() {
            helpers.navigateToSite();
            helpers.addTodo("New todo item");
            helpers.getInputText().then(function(value) {
                assert.equal(value, "");
            });
        });
        testing.it("adds the todo item to the list", function() {
            helpers.navigateToSite();
            helpers.addTodo("New todo item");
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 1);
            });
        });
        testing.it("displays an error if the request fails", function() {
            helpers.setupErrorRoute("post", "/api/todo");
            helpers.navigateToSite();
            helpers.addTodo("New todo item");
            helpers.getErrorText().then(function(text) {
                assert.equal(text, "Failed to create item. Server returned 500 - Internal Server Error");
            });
        });
        testing.it("can be done multiple times", function() {
            helpers.navigateToSite();
            helpers.addTodo("New todo item");
            helpers.addTodo("Another new todo item");
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 2);
            });
        });
    });
    testing.describe("on delete todo item", function() {
        testing.it("displays an error if the request fails", function() {
            helpers.setupErrorRoute("delete", "/api/todo/0");
            helpers.navigateToSite();
            helpers.addTodo("New todo item");
            helpers.removeTodo(0);
            helpers.getErrorText().then(function(text) {
                assert.equal(text, "Failed to delete item. Server returned 500 - Internal Server Error");
            });
        });
        testing.it("can an item be removed", function() {
            helpers.navigateToSite();
            helpers.addTodo("New todo item");
            helpers.removeTodo(0);
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 0);
            });
        });
        testing.it("can remove specific todo item", function() {
            helpers.navigateToSite();
            helpers.addTodo("New todo item");
            helpers.addTodo("Another todo item");
            helpers.addTodo("A third todo item");
            helpers.removeTodo(1);
            helpers.getTodoList().then(function() {
                helpers.containsId("del_1").then(function(res) {
                    assert.equal(res, false);
                });
            });
        });
    });
    testing.describe("on Complete todo item", function() {
        testing.it("can a specific todo be completed", function() {
            helpers.navigateToSite();
            helpers.addTodo("New todo item");
            helpers.addTodo("Second todo item");
            helpers.addTodo("Third todo item");
            helpers.completeTodo(1);
            helpers.isCompleted(1).then(function(res) {
                assert.equal(res, true);
            });
        });
        testing.it("is the complete button removed", function() {
            helpers.navigateToSite();
            helpers.addTodo("New todo item");
            helpers.completeTodo(0);
            helpers.getTodoList().then(function() {
                helpers.containsId("complete_0").then(function(res) {
                    assert.equal(res, false);
                });
            });
        });
    });
    testing.describe("is todo counter working correctly", function() {
        testing.it("can the number of items to be completed be displayed", function() {
            helpers.navigateToSite();
            helpers.addTodo("New todo item");
            helpers.addTodo("Second todo item");
            helpers.addTodo("Third todo item");
            helpers.completeTodo(1);
            helpers.removeTodo(0);
            helpers.getCount().then(function(res) {
                assert.equal(res, "1");
            });
        });
        testing.it("does it work for a different number of items", function() {
            helpers.navigateToSite();
            helpers.addTodo("New todo item");
            helpers.addTodo("Second todo item");
            helpers.addTodo("Third todo item");
            helpers.addTodo("fourth todo item");
            helpers.addTodo("fifth todo item");
            helpers.completeTodo(1);
            helpers.removeTodo(0);
            helpers.getCount().then(function(res) {
                assert.equal(res, "3");
            });
        });
    });
    testing.describe("on delete all completed items", function() {
        testing.it("does the button appear when there are no completed items", function() {
            helpers.navigateToSite();
            helpers.addTodo("New todo item");
            helpers.getTodoList().then(function() {
                helpers.containsId("del_completed").then(function(res) {
                    assert.equal(res, false);
                });
            });
        });
        testing.it("can the button delete all completed items", function() {
            helpers.navigateToSite();
            helpers.addTodo("New todo item");
            helpers.addTodo("Second todo item");
            helpers.addTodo("Third todo item");
            helpers.addTodo("fourth todo item");
            helpers.addTodo("fifth todo item");
            helpers.completeTodo(1);
            helpers.completeTodo(0);
            helpers.completeTodo(3);
            helpers.removeCompleted();
            helpers.containsId("todo_text_0").then(function(res) {
                assert.equal(res, false);
            });
            helpers.containsId("todo_text_1").then(function(res) {
                assert.equal(res, false);
            });
            helpers.containsId("todo_text_2").then(function(res) {
                assert.equal(res, true);
            });
            helpers.containsId("todo_text_3").then(function(res) {
                assert.equal(res, false);
            });
            helpers.containsId("todo_text_4").then(function(res) {
                assert.equal(res, true);
            });
        });
    });
    testing.describe("is the filter working correctly", function() {
        testing.it("does the active filter work correctly", function() {
            helpers.navigateToSite();
            helpers.addTodo("New todo item");
            helpers.addTodo("Second todo item");
            helpers.addTodo("Third todo item");
            helpers.addTodo("fourth todo item");
            helpers.addTodo("fifth todo item");
            helpers.completeTodo(1);
            helpers.completeTodo(0);
            helpers.completeTodo(3);
            helpers.selectFilter("active")
            helpers.containsId("todo_text_0").then(function(res) {
                assert.equal(res, false);
            });
            helpers.containsId("todo_text_1").then(function(res) {
                assert.equal(res, false);
            });
            helpers.containsId("todo_text_2").then(function(res) {
                assert.equal(res, true);
            });
            helpers.containsId("todo_text_3").then(function(res) {
                assert.equal(res, false);
            });
            helpers.containsId("todo_text_4").then(function(res) {
                assert.equal(res, true);
            });
        })
        testing.it("does the completed filter work correctly", function() {
            helpers.navigateToSite();
            helpers.addTodo("New todo item");
            helpers.addTodo("Second todo item");
            helpers.completeTodo(1);
            helpers.selectFilter("complete")
            helpers.containsId("todo_text_0").then(function(res) {
                assert.equal(res, false);
            });
            helpers.containsId("todo_text_1").then(function(res) {
                assert.equal(res, true);
            });
        });
        testing.it("does the completed filter work correctly", function() {
            helpers.navigateToSite();
            helpers.addTodo("New todo item");
            helpers.addTodo("Second todo item");
            helpers.completeTodo(1);
            helpers.selectFilter("complete")
            helpers.containsId("todo_text_0").then(function(res) {
                assert.equal(res, false);
            });
            helpers.containsId("todo_text_1").then(function(res) {
                assert.equal(res, true);
            });
        });
        testing.it("can the filter be changed between settings", function() {
            helpers.navigateToSite();
            helpers.addTodo("New todo item");
            helpers.addTodo("Second todo item");
            helpers.completeTodo(1);
            helpers.selectFilter("complete")
            helpers.containsId("todo_text_0").then(function(res) {
                assert.equal(res, false);
            });
            helpers.containsId("todo_text_1").then(function(res) {
                assert.equal(res, true);
            });
            helpers.selectFilter("all")
            helpers.containsId("todo_text_0").then(function(res) {
                assert.equal(res, true);
            });
            helpers.containsId("todo_text_1").then(function(res) {
                assert.equal(res, true);
            });
            helpers.selectFilter("active")
            helpers.containsId("todo_text_0").then(function(res) {
                assert.equal(res, true);
            });
            helpers.containsId("todo_text_1").then(function(res) {
                assert.equal(res, false);
            });
        });
    });
});

