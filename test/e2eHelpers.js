const express = require("express");
const createServer = require("../server/server");
const webdriver = require("selenium-webdriver");
const istanbul = require("istanbul");
const path = require("path");
const fs = require("fs");

const testPort = 52684;
const baseUrl = "http://localhost:" + testPort;
const instrumenter = new istanbul.Instrumenter();
const collector = new istanbul.Collector();
const gatheringCoverage = process.env.running_under_istanbul;
const coverageFilename = "build_artifacts/coverage-e2e.json";

let driver;
let router;
let server;

module.exports.setupDriver = function() {
    driver = new webdriver.Builder().forBrowser("chrome").build();
};

module.exports.setupServer = function(done) {
    router = express.Router();
    if (gatheringCoverage) {
        router.get("/main.js", function(req, res) {
            const absPath = path.join(__dirname, "..", "public", "main.js");
            res.send(instrumenter.instrumentSync(fs.readFileSync("public/main.js", "utf8"), absPath));
        });
    }
    server = createServer(testPort, router, done);
};

module.exports.teardownServer = function(done) {
    server.close(done);
};

module.exports.teardownDriver = async function() {
    if (gatheringCoverage) {
        const coverage = await driver.executeScript("return __coverage__;")
        collector.add(coverage);
    }
    driver.quit();
};

module.exports.reportCoverage = function() {
    if (gatheringCoverage) {
        fs.writeFileSync(coverageFilename, JSON.stringify(collector.getFinalCoverage()), "utf8");
    }
};

module.exports.navigateToSite = function() {
    return driver.get(baseUrl);
};

module.exports.getTitleText = function() {
    return driver.findElement(webdriver.By.css("h1")).getText();
};

module.exports.getCount = function() {
    return driver.findElement(webdriver.By.id("count-label")).getText();
}

module.exports.getInputText = function() {
    return driver.findElement(webdriver.By.id("new-todo")).getAttribute("value");
};

module.exports.getErrorText = function() {
    const errorElement = driver.findElement(webdriver.By.id("error"));
    driver.wait(webdriver.until.elementTextContains(errorElement, "Failed"), 5000);
    return errorElement.getText();
};

module.exports.getTodoList = function() {
    const todoListLoading = driver.findElement(webdriver.By.id("todo-list-Loading"));
    driver.wait(webdriver.until.elementIsNotVisible(todoListLoading), 5000);
    return driver.findElements(webdriver.By.css("#todo-list li"));
};

module.exports.getTodoText = async function(id) {
    return await driver.findElements(webdriver.By.id(id)).getAttribute("value");
}

module.exports.addTodo = async function(text) {
    await driver.findElement(webdriver.By.id("new-todo")).sendKeys(text);
    return driver.findElement(webdriver.By.id("submit-todo")).click();
};

module.exports.setupErrorRoute = function(action, route) {
    if (action === "get") {
        router.get(route, function(req, res) {
            res.sendStatus(500);
        });
    }
    if (action === "post") {
        router.post(route, function(req, res) {
            res.sendStatus(500);
        });
    }
    if (action === "delete") {
        router.delete(route, function(req, res) {
            res.sendStatus(500);
        });
    }
};

module.exports.removeTodo = function(id) {
    return driver.findElement(webdriver.By.id("del_" + id)).click();
};

module.exports.completeTodo = function(id) {
    return driver.findElement(webdriver.By.id("complete_" + id)).click();
};

module.exports.removeCompleted = function() {
    return driver.findElement(webdriver.By.id("del_completed")).click();
};

module.exports.containsId = async function(id) {
    const elements = await driver.findElements(webdriver.By.id(id));
    return elements.length > 0;
}

module.exports.isCompleted = async function(id) {
    const element = await driver.findElement(webdriver.By.id("todo_text_" + id));
    return await elementHasClass(element,"completed")
}

async function elementHasClass(element, classToFind) {
    const elementClasses = await element.getAttribute("class");
    const matches = elementClasses.split(" ").filter(function(element) {
        return element === classToFind;
    });
    return matches.length === 1;
}

module.exports.selectFilter = function(filter) {
    return driver.findElement(webdriver.By.id("dropdown-" + filter)).click();
}

module.exports.simulateChange = function() {
    router.use(function (req, res, next) {
        const oldSend = res.send;
        res.send = function() {
            arguments[0] = JSON.stringify([
                {
                    "id": "0",
                    "isComplete": false,
                    "title": "New Item"
                }
            ]);
            oldSend.apply(res, arguments);
        }
        next();
    });
}

module.exports.sleep = function(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports.waitUntilLoaded = function() {
    return driver.wait(webdriver.until.elementLocated(webdriver.By.id("todo-form")), 5000);
};

