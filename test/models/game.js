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
        viewPort: [1000, 1000],
        _player: player._id,
        scores: 100
    };

    var PointSchema = mongoose.Schema({
        p: [Number]
    }, {_id: false});

    var PointModel = mongoose.model("Point", PointSchema);

    it("can create a new Game", function(done) {

        GameModel.create(game, function(err, model) {

            expect(err).to.not.exist;
            expect(model.start).to.deep.equal(new Date(1000));
            expect(model.end).to.deep.equal(new Date(2000));

            //var p1 = new PointModel({p: [1, 1]});
            //var p2 = new PointModel({p: [2, 3]});

            expect(model.path[0].p[0]).to.equal(1);
            expect(model.path[1].p[0]).to.equal(2);
            expect(model.path[1].p[1]).to.equal(3);

            /*
            expect(model.collisions).to.deep.equal([{
                class: "bonus",
                type: "big",
                position: [10, 20]
            }]);*/
            expect(model.breatheAmount).to.equal(1000);
            //expect(model.viewPort).to.equal([ 1000, 1000 ]);
            //expect(model._id).to.equal(player._id);
            expect(model.scores).to.equal(100);

            done();
        });
    });
});