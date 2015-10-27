/**
 * Created by USER on 28.10.2015.
 */
var expect = require("chai").expect;
var sinon = require("sinon");

var utils = require("../support/utils");
var PlayerModel = require("../../models/player");
var GameModel = require("../../models/game");
var SessionModel = require("../../models/session");


describe("Session model", function() {
    var player = new PlayerModel({
        name: "Oleg",
        scores: 32,
        place: 3,
        hostComputer: "aa2"
    });

    var game = new GameModel({
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
    });

    var session = {
        start: new Date(1000),
        end: new Date(2000),
        hostComputer: "123a",
        _games: [game._id]
    };

    it("can create a new Session", function(done) {
        SessionModel.create(session, function(err, model) {
            expect(err).to.not.exist;

            expect(model.start).to.deep.equal(new Date(1000));
            expect(model.end).to.deep.equal(new Date(2000));
            expect(model.hostComputer).to.equal("123a");
            expect(model._games[0]).to.equal(game._id);

            done();
        });
    });

    it("can be populated by Game and Player", function(done) {
        player.save()
            .then(function(p) {
                return game.save();
            })
            .then(function(g) {
                return SessionModel.create(session);
            })
            .then(function(s) {
                return s.populate("_games").execPopulate();
            })
            .then(function(s){
                expect(s._games[0]._id).to.deep.equal(game._id);
                return s._games[0].populate("_player").execPopulate();
            })
            .then(function(g) {
                expect(g._player._id).to.deep.equal(player._id);
                expect(g._player.name).to.equal("Oleg");
                done();
            })
    });
});
