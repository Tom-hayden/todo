const express = require("express");
const createServer = require("../../server/server/server");
const webdriver = require("selenium-webdriver");
const istanbul = require("istanbul");
const path = require("path");
const fs = require("fs");

const serverPort = 8080;
const baseUrl = "http://localhost:" + serverPort;
const instrumenter = new istanbul.Instrumenter();
const collector = new istanbul.Collector();
const gatheringCoverage = process.env.running_under_istanbul;
const coverageFilename = "build_artifacts/coverage-e2e.json";
const clientPath = "../client/public";

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
            const absPath = path.join(__dirname, "..", "client", "public", "main.js");
            res.send(instrumenter.instrumentSync(fs.readFileSync(clientPath + "/main.js", "utf8"), absPath));
        });
    }
    server = createServer(serverPort, router, done);
};

module.exports.teardownServer = function(done) {
    server.close(done);
};

module.exports.teardownDriver = async function() {
    if (gatheringCoverage) {
        const coverage = await driver.executeScript("return __coverage__;");
        collector.add(coverage);
    }
    driver.quit();
};

module.exports.serverTimeout = function(waitTime) {
    driver.manage().timeouts().implicitlyWait(waitTime);
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
};

module.exports.getInputText = function() {
    return driver.findElement(webdriver.By.id("todo-input-box")).getAttribute("value");
};

module.exports.getErrorText = function() {
    const errorElement = driver.findElement(webdriver.By.id("error"));
    driver.wait(webdriver.until.elementTextContains(errorElement, "Failed"), 5000);
    return errorElement.getText();
};

module.exports.getTodoList = function() {
    return driver.findElements(webdriver.By.css("#todo-list li"));
};

module.exports.getTodoText = async function(id) {
    const todoElement = await driver.findElement(webdriver.By.id(id));
    return await getFirstElementText(todoElement);
};

async function getFirstElementText(element) {
    const elementText = await element.getText();
    return elementText.split("\n")[0];

}

module.exports.addTodo = async function(text) {
    await driver.findElement(webdriver.By.id("todo-input-box")).sendKeys(text);
    return driver.findElement(webdriver.By.id("submit-todo")).click();
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
};

module.exports.isCompleted = async function(id) {
    const element = await driver.findElement(webdriver.By.id("todo_text_" + id));
    return await elementHasClass(element,"completed");
};

async function elementHasClass(element, classToFind) {
    const elementClasses = await element.getAttribute("class");
    const matches = elementClasses.split(" ").filter(function(element) {
        return element === classToFind;
    });
    return matches.length === 1;
}

module.exports.selectFilter = function(filter) {
    return driver.findElement(webdriver.By.id("dropdown-" + filter)).click();
};

module.exports.sleep = function(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

module.exports.waitUntilLoaded = function() {
    return driver.wait(webdriver.until.elementLocated(webdriver.By.id("todo-list-container")), 5000);
};
