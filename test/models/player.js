var expect = require("chai").expect;
var sinon = require("sinon");

var utils = require("../support/utils");
var PlayerModel = require("../../models/player");

describe("Player model", function() {
    it("can create a new Player", function(done) {
        var p = {
            name: "Вася",
            scores: 30,
            hostComputer: "3a82c",
            place: 1
        };

        PlayerModel.create(p, function(err, model) {
            expect(err).to.not.exist;
            expect(model.name).to.equal("Вася");
            expect(model.scores).to.equal(30);
            expect(model.hostComputer).to.equal("3a82c");
            expect(model.place).to.equal(1);
            expect(model._id).to.exist;

            done();
        });
    });
});