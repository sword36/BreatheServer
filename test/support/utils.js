var config = require("../../config");
var mongoose = require("mongoose");

beforeEach(function(done) {
    function clearDB() {
        for (var i in mongoose.connection.collections) {
            if (mongoose.connection.collections.hasOwnProperty(i)) {
                mongoose.connection.collections[i].remove({}, function() {});
            }
        }
        return done();
    }

    if (mongoose.connection.readyState === 0) {
        mongoose.connect(config.db.test, function(err) {
            if (err) {
                console.log("err");
                throw  err;
            }
            return clearDB();
        });
    } else {
        return clearDB();
    }
});

afterEach(function(done) {
    mongoose.disconnect(function() {
        return done();
    });
});