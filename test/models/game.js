/**
 * Created by USER on 26.10.2015.
 */
var expect = require("chai").expect;
var sinon = require("sinon");

var utils = require("../support/utils");
var mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;
var GameModel = require("../../models/game");
var PlayerModel = require("../../models/player");

describe("Game model", function() {
    var player = new PlayerModel({
        name: "Oleg",
        scores: 32,
        place: 3,
        hostComputer: "aa2"
    });

    var game = {
        start: new Date(1000),
        end: new Date(2000),
        path: [
            {p: [1, 1]},
            {p: [2, 3]}
        ],
        collisions: [{
            class: "bonus",
            type: "big",
            position: [10, 20]
        }],
        breatheAmount: 1000,
        viewPort: [1000, 1200],
        _player: player._id,
        scores: 100
    };

    it("can create a new Game", function(done) {
        GameModel.create(game, function(err, model) {
            expect(err).to.not.exist;
            expect(model.start).to.deep.equal(new Date(1000));
            expect(model.end).to.deep.equal(new Date(2000));

            expect(model.path[0].p[0]).to.equal(1);
            expect(model.path[0].p[1]).to.equal(1);
            expect(model.path[1].p[0]).to.equal(2);
            expect(model.path[1].p[1]).to.equal(3);


            expect(model.collisions[0].class).to.equal("bonus");
            expect(model.collisions[0].type).to.equal("big");
            expect(model.collisions[0].position[0]).to.equal(10);
            expect(model.collisions[0].position[1]).to.equal(20);

            expect(model.breatheAmount).to.equal(1000);
            expect(model.viewPort[0]).to.equal(1000);
            expect(model.viewPort[1]).to.equal(1200);

            expect(model.scores).to.equal(100);
            expect(model._player).to.equal(player._id);

            done();
        });
    });

    it("can be populated by Player", function(done) {
        player.save()
            .then(function(p) {
                return GameModel.create(game);
            })
            .then(function(g) {
                return GameModel.findOne({_id: g._id}).populate("_player").exec();
            })
            .then(function(g) {
                expect(g._player).to.be.ok;
                expect(g._player._id).to.be.deep.equal(player._id);
                expect(g._player.name).to.be.equal("Oleg");

                done();
            })
            .then(undefined, function(err) { //catch(..) {}
                expect(err).to.not.exist;

                done();
            })
    });
});