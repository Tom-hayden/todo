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
        testing.it("displays TODO title", async function() {
            helpers.navigateToSite();
            const text = await  helpers.getTitleText()
            assert.equal(text, "TODO List");
        });
        testing.it("displays empty TODO list", async function() {
            helpers.navigateToSite();
            const elements = await helpers.getTodoList();
            assert.equal(elements.length, 0);
        });
        testing.it("displays an error if the request fails", async function() {
            helpers.setupErrorRoute("get", "/api/todo");
            helpers.navigateToSite();
            const text = await helpers.getErrorText()
            assert.equal(text, "Failed to get list. Server returned 500 - Internal Server Error");
        });
    });
    testing.describe("on create todo item", function() {
        testing.it("clears the input field", async function() {
            helpers.navigateToSite();
            await helpers.addTodo("New todo item");
            const text = await helpers.getInputText();
            assert.equal(text, "");
        });
        testing.it("adds the todo item to the list", async function() {
            helpers.navigateToSite();
            await helpers.addTodo("New todo item");
            const elements = await helpers.getTodoList();
            assert.equal(elements.length, 1);
        });
        testing.it("displays an error if the request fails", async function() {
            helpers.setupErrorRoute("post", "/api/todo");
            helpers.navigateToSite();
            await helpers.addTodo("New todo item");
            const text = await helpers.getErrorText();
            assert.equal(text, "Failed to create item. Server returned 500 - Internal Server Error");
        });
        testing.it("can be done multiple times", async function() {
            helpers.navigateToSite();
            await Promise.all([
                helpers.addTodo("New todo item"),
                helpers.addTodo("Another new todo item")
            ]);
            const elements = await helpers.getTodoList();
            assert.equal(elements.length, 2);
        });
    });
    testing.describe("on delete todo item", function() {
        testing.it("displays an error if the request fails", async function() {
            helpers.setupErrorRoute("delete", "/api/todo/0");
            helpers.navigateToSite();
            await helpers.addTodo("New todo item");
            await helpers.removeTodo(0);
            const text = await helpers.getErrorText();
            assert.equal(text, "Failed to delete item. Server returned 500 - Internal Server Error");
        });
        testing.it("can an item be removed", async function() {
            helpers.navigateToSite();
            await helpers.addTodo("New todo item");
            await helpers.removeTodo(0);
            const elements = await helpers.getTodoList();
            assert.equal(elements.length, 0);
        });
        testing.it("can remove specific todo item", async function() {
            helpers.navigateToSite();
            await Promise.all([
                helpers.addTodo("New todo item"),
                helpers.addTodo("Another todo item"),
                helpers.addTodo("A third todo item")
            ]);
            await helpers.removeTodo(1);
            await helpers.getTodoList();
            const res = await helpers.containsId("del_1");
            assert.equal(res, false);
        });
    });
    testing.describe("on Complete todo item", function() {
        testing.it("can a specific todo be completed", async function() {
            helpers.navigateToSite();
            await Promise.all([
                helpers.addTodo("New todo item"),
                helpers.addTodo("Second todo item"),
                helpers.addTodo("Third todo item")
            ]);
            await helpers.completeTodo(1);
            const res = await helpers.isCompleted(1);
            assert.equal(res, true);
        });
        testing.it("is the complete button removed", async function() {
            helpers.navigateToSite();
            await helpers.addTodo("New todo item");
            await helpers.completeTodo(0);
            await helpers.getTodoList();
            const res = await helpers.containsId("complete_0")
            assert.equal(res, false);
        });
    });
    testing.describe("is todo counter working correctly", function() {
        testing.it("can the number of items to be completed be displayed", async function() {
            helpers.navigateToSite();
            await Promise.all([
                helpers.addTodo("New todo item"),
                helpers.addTodo("Second todo item"),
                helpers.addTodo("Third todo item")
            ]);
            await Promise.all([
                helpers.completeTodo(1),
                helpers.removeTodo(0),
            ]);
            const count = await helpers.getCount();
            assert.equal(count, "1");
        });
        testing.it("does it work for a different number of items", async function() {
            helpers.navigateToSite();
            await Promise.all([
                helpers.addTodo("New todo item"),
                helpers.addTodo("Second todo item"),
                helpers.addTodo("Third todo item"),
                helpers.addTodo("fourth todo item"),
                helpers.addTodo("fifth todo item")
            ]);
            await Promise.all([
                helpers.completeTodo(1),
                helpers.removeTodo(0)
            ]);
            const count = await helpers.getCount();
            assert.equal(count, "3");
        });
    });
    testing.describe("on delete all completed items", function() {
        testing.it("does the button appear when there are no completed items", async function() {
            helpers.navigateToSite();
            await helpers.addTodo("New todo item");
            await helpers.getTodoList();
            const res = await helpers.containsId("del_completed");
            assert.equal(res, false);
        });
        testing.it("can the button delete all completed items", async function() {
            helpers.navigateToSite();
            await Promise.all([
                helpers.addTodo("New todo item"),
                helpers.addTodo("Second todo item"),
                helpers.addTodo("Third todo item"),
                helpers.addTodo("fourth todo item"),
                helpers.addTodo("fifth todo item")
            ]);
            await Promise.all([
                helpers.completeTodo(1),
                helpers.completeTodo(0),
                helpers.completeTodo(3)
            ]);
            await helpers.removeCompleted();
            const todo0Exists = await helpers.containsId("todo_text_0");
            assert.equal(todo0Exists, false);
            const todo1Exists = await helpers.containsId("todo_text_1");
            assert.equal(todo1Exists, false);
            const todo2Exists = await helpers.containsId("todo_text_2");
            assert.equal(todo2Exists, true);
            const todo3Exists = await helpers.containsId("todo_text_3");
            assert.equal(todo3Exists, false);
            const todo4Exists = await helpers.containsId("todo_text_4");
            assert.equal(todo4Exists, true);
        });
    });
    testing.describe("is the filter working correctly", function() {
        testing.it("does the active filter work correctly", async function() {
            helpers.navigateToSite();
            await Promise.all([
                helpers.addTodo("New todo item"),
                helpers.addTodo("Second todo item"),
                helpers.addTodo("Third todo item"),
                helpers.addTodo("fourth todo item"),
                helpers.addTodo("fifth todo item")
            ]);
            await Promise.all([
                helpers.completeTodo(1),
                helpers.completeTodo(0),
                helpers.completeTodo(3)
            ]);
            await helpers.selectFilter("active");
            const todo0Exists = await helpers.containsId("todo_text_0");
            assert.equal(todo0Exists, false);
            const todo1Exists = await helpers.containsId("todo_text_1");
            assert.equal(todo1Exists, false);
            const todo2Exists = await helpers.containsId("todo_text_2");
            assert.equal(todo2Exists, true);
            const todo3Exists = await helpers.containsId("todo_text_3");
            assert.equal(todo3Exists, false);
            const todo4Exists = await helpers.containsId("todo_text_4");
            assert.equal(todo4Exists, true);
        });
        testing.it("does the completed filter work correctly", async function() {
            await helpers.navigateToSite();
            await Promise.all([
                helpers.addTodo("New todo item"),
                helpers.addTodo("Second todo item")
            ]);
            await helpers.completeTodo(1);
            await helpers.selectFilter("complete");
            const todo0Exists = await helpers.containsId("todo_text_0");
            assert.equal(todo0Exists, false, "Expected unaltered todo to be removed");
            const todo1Exists = await helpers.containsId("todo_text_1");
            assert.equal(todo1Exists, true, "Expected completed todo to be shown");
        });
        testing.it("can the filter be changed between settings", async function() {
            helpers.navigateToSite();
            await Promise.all([
                helpers.addTodo("New todo item"),
                helpers.addTodo("Second todo item")
            ]);
            await helpers.completeTodo(1);
            await helpers.selectFilter("complete")
            let todo0Exists = await helpers.containsId("todo_text_0");
            assert.equal(todo0Exists, false);
            let todo1Exists = await helpers.containsId("todo_text_1");
            assert.equal(todo1Exists, true);
            await helpers.selectFilter("all")
            todo0Exists = await helpers.containsId("todo_text_0");
            assert.equal(todo0Exists, true);
            todo1Exists = await helpers.containsId("todo_text_1");
            assert.equal(todo1Exists, true);
            await helpers.selectFilter("active")
            todo0Exists = await helpers.containsId("todo_text_0");
            assert.equal(todo0Exists, true);
            todo1Exists = await helpers.containsId("todo_text_1");
            assert.equal(todo1Exists, false);
        });
    });
});

