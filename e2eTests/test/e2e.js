const testing = require("selenium-webdriver/testing");
const assert = require("chai").assert;
const helpers = require("./e2eHelpers");
const waitForResponse = 500;

testing.describe("end to end", function() {
    this.timeout(20000);
    testing.before(helpers.setupDriver);
    testing.beforeEach(function() {
        helpers.setupServer();
        helpers.serverTimeout(1000);
    });
    testing.afterEach(helpers.teardownServer);
    testing.after(function() {
        helpers.teardownDriver();
    });

    testing.describe("on page load", function() {
        testing.it("displays TODO title", async function() {
            await helpers.navigateToSite();
            const text = await  helpers.getTitleText();
            assert.equal(text, "Todo List");
        });
        testing.it("displays empty TODO list", async function() {
            await helpers.navigateToSite();
            const elements = await helpers.getTodoList();
            assert.equal(elements.length, 0);
        });
    });
    testing.describe("on create todo item", function() {
        testing.it("clears the input field", async function() {
            await helpers.navigateToSite();
            await helpers.addTodo("New todo item");
            const text = await helpers.getInputText();
            assert.equal(text, "");
        });
        testing.it("adds the todo item to the list", async function() {
            await helpers.navigateToSite();
            await helpers.addTodo("New todo item");
            const todoExists = await helpers.containsId("todo_text_0");
            assert.equal(todoExists, true);
            const todoText = await helpers.getTodoText("todo_text_0");
            assert.equal(todoText, "New todo item");
        });
        testing.it("can be done multiple times", async function() {
            await helpers.navigateToSite();
            await Promise.all([
                helpers.addTodo("New todo item"),
                helpers.addTodo("Another new todo item")
            ]);
            await helpers.sleep(waitForResponse);
            const elements = await helpers.getTodoList();
            assert.equal(elements.length, 2);
        });
    });
    testing.describe("on delete todo item", function() {
        testing.it("can an item be removed", async function() {
            await helpers.navigateToSite();
            await helpers.addTodo("New todo item");
            await helpers.removeTodo(0);
            await helpers.sleep(waitForResponse);
            const elements = await helpers.getTodoList();
            assert.equal(elements.length, 0);
        });
        testing.it("can remove specific todo item", async function() {
            await helpers.navigateToSite();
            await Promise.all([
                helpers.addTodo("New todo item"),
                helpers.addTodo("Another todo item"),
                helpers.addTodo("A third todo item")
            ]);
            await helpers.removeTodo(1);
            await helpers.sleep(waitForResponse);
            await helpers.getTodoList();
            const res = await helpers.containsId("del_1");
            assert.equal(res, false);
        });
    });
    testing.describe("on Complete todo item", function() {
        testing.it("can a specific todo be completed", async function() {
            await helpers.navigateToSite();
            await Promise.all([
                helpers.addTodo("New todo item"),
                helpers.addTodo("Second todo item"),
                helpers.addTodo("Third todo item")
            ]);
            await helpers.completeTodo(1);
            await helpers.sleep(waitForResponse);
            const res = await helpers.isCompleted(1);
            assert.equal(res, true);
        });
        testing.it("is the complete button removed", async function() {
            await helpers.navigateToSite();
            await helpers.addTodo("New todo item");
            await helpers.completeTodo(0);
            await helpers.getTodoList();
            await helpers.sleep(waitForResponse);
            const res = await helpers.containsId("complete_0");
            assert.equal(res, false);
        });
    });
    testing.describe("is todo counter working correctly", function() {
        testing.it("can the number of items to be completed be displayed", async function() {
            await helpers.navigateToSite();
            await Promise.all([
                helpers.addTodo("New todo item"),
                helpers.addTodo("Second todo item"),
                helpers.addTodo("Third todo item")
            ]);
            await Promise.all([
                helpers.completeTodo(1),
                helpers.removeTodo(0),
            ]);
            await helpers.sleep(waitForResponse);
            const count = await helpers.getCount();
            assert.equal(count, "Number of Todos: 1");
        });
        testing.it("does it work for a different number of items", async function() {
            await helpers.navigateToSite();
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
            await helpers.sleep(waitForResponse);
            const count = await helpers.getCount();
            assert.equal(count, "Number of Todos: 3");
        });
    });
    testing.describe("on delete all completed items", function() {
        testing.it("does the button appear when there are no completed items", async function() {
            await helpers.navigateToSite();
            await helpers.addTodo("New todo item");
            await helpers.getTodoList();
            const res = await helpers.containsId("del_completed");
            assert.equal(res, false);
        });
        testing.it("can the button delete all completed items", async function() {
            await helpers.navigateToSite();
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
            await helpers.sleep(waitForResponse);
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
            await helpers.navigateToSite();
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
            await helpers.sleep(waitForResponse);
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
            await helpers.sleep(waitForResponse);
            const todo0Exists = await helpers.containsId("todo_text_0");
            assert.equal(todo0Exists, false, "Expected unaltered todo to be removed");
            const todo1Exists = await helpers.containsId("todo_text_1");
            assert.equal(todo1Exists, true, "Expected completed todo to be shown");
        });
        testing.it("can the filter be changed between settings", async function() {
            await helpers.navigateToSite();
            await Promise.all([
                helpers.addTodo("New todo item"),
                helpers.addTodo("Second todo item")
            ]);
            await helpers.completeTodo(1);
            await helpers.sleep(waitForResponse);
            await helpers.selectFilter("complete");
            let todo0Exists = await helpers.containsId("todo_text_0");
            assert.equal(todo0Exists, false);
            let todo1Exists = await helpers.containsId("todo_text_1");
            assert.equal(todo1Exists, true);
            await helpers.selectFilter("all");
            todo0Exists = await helpers.containsId("todo_text_0");
            assert.equal(todo0Exists, true);
            todo1Exists = await helpers.containsId("todo_text_1");
            assert.equal(todo1Exists, true);
            await helpers.selectFilter("active");
            todo0Exists = await helpers.containsId("todo_text_0");
            assert.equal(todo0Exists, true);
            todo1Exists = await helpers.containsId("todo_text_1");
            assert.equal(todo1Exists, false);
        });
    });
});

