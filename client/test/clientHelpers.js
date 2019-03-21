const webdriver = require("selenium-webdriver");
const socketio = require("socket.io");
const express = require("express");

const testPort = 52684;
const baseUrl = "http://localhost:" + testPort;
const app = express();


let server;
let io;
let driver;


module.exports.setupDriver = function() {
    driver = new webdriver.Builder().forBrowser("chrome").build();
};

module.exports.tearDownDriver = function() {
    driver.quit();
};

module.exports.setupServer = function() {
    app.use(express.static("public"));
    server = app.listen(testPort);
    io = socketio.listen(server);
}

module.exports.tearDownServer = function(done) {
    io.close();
    server.close(done);
}

module.exports.navigateToSite = function() {
    return driver.get(baseUrl);
};

module.exports.getErrorText = function() {
    const errorElement = driver.findElement(webdriver.By.id("error"));
    driver.wait(webdriver.until.elementTextContains(errorElement, "Failed"), 5000);
    return errorElement.getText();
};

module.exports.setupServerError = function() {
    const responses = [function(socket) {
        socket.emit("serverError", "Test Error")
    }];
    setupServerResponse(responses);
}

function setupServerResponse(responses) {
    io.on("connection", function(socket) {
        responses.forEach(function(response) {
            response(socket);
        })
    })
}
