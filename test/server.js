var expect = require("chai").expect;
var sinon = require("sinon");

var app = require("../app");
app.set("port", 8000);
var http = require("http");
var server = http.createServer(app);
var utils = require("./support/utils");

describe("Server", function() {
    before(function() {
        server.listen(8000);
    });

    after(function() {
        server.close();
    });

    it("can return 200", function(done) {
        http.get("http://localhost:8000", function(res) {
            expect(res.statusCode).equal(200);
            done();
        });
    });
});