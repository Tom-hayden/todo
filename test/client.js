const testing = require("selenium-webdriver/testing");
const assert = require("chai").assert;
const helpers = require("./clientHelpers");


testing.describe("client", function() {
    this.timeout(20000);
    testing.before(helpers.setupDriver);
    testing.beforeEach(function() {
        helpers.setupServer();
    });
    testing.afterEach(function() {
        helpers.tearDownServer();
    });
    testing.after(helpers.tearDownDriver);

        testing.describe("On recieve error", function() {
            testing.it("Displays error message", async function() {
                helpers.setupServerError();
                helpers.navigateToSite();
                const text = await helpers.getErrorText()
                assert.equal(typeof text, "string");
                assert.equal(text, "Failed - Server Error: Test Error");
            });
        });
});