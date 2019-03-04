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

module.exports.teardownDriver = function() {
    if (gatheringCoverage) {
        driver.executeScript("return __coverage__;").then(function (coverage) {
            collector.add(coverage);
        });
    }
    driver.quit();
};

module.exports.reportCoverage = function() {
    if (gatheringCoverage) {
        fs.writeFileSync(coverageFilename, JSON.stringify(collector.getFinalCoverage()), "utf8");
    }
};

module.exports.navigateToSite = function() {
    driver.get(baseUrl);
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

module.exports.addTodo = function(text) {
    driver.findElement(webdriver.By.id("new-todo")).sendKeys(text);
    driver.findElement(webdriver.By.id("submit-todo")).click();
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
    driver.findElement(webdriver.By.id("del_" + id)).click();
};

module.exports.completeTodo = function(id) {
    driver.findElement(webdriver.By.id("complete_" + id)).click();
};

module.exports.removeCompleted = function() {
    driver.findElement(webdriver.By.id("del_completed")).click();
};

module.exports.containsId = function(id) {
    return driver.findElements(webdriver.By.id(id)).then(function(res) {
        return res.length > 0;
    });
}

module.exports.isCompleted = function(id) {
    const ele = driver.findElement(webdriver.By.id("todo_text_" + id));
    return ele.then(function(res) {
        return elementHasClass(res,"completed").then(function(res) {
            return res;
        });
    });
}

function elementHasClass(element, classString) {
    return element.getAttribute("class").then(function(res) {
        let matches = res.split(" ").filter(function(ele) {
            return ele === classString;
        });
        return matches.length === 1;
    });
}

module.exports.selectFilter = function(filter) {
    driver.findElement(webdriver.By.id("dropdown-" + filter)).click();
}

