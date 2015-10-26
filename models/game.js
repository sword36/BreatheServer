/**
 * Created by USER on 26.10.2015.
 */
var mongoose = require("mongoose");

var ObjectId = mongoose.Schema.Types.ObjectId;

var PointSchema = mongoose.Schema({
    p: [Number]
}, {_id: false});

var CollisionSchema = mongoose.Schema({
    class: String,
    type: String,
    position: [Number]
}, {_id: false});

var GameSchema = mongoose.Schema({
    start: Date,
    end: Date,
    path: [PointSchema],
    collisions: [CollisionSchema],
    breatheAmount: Number,
    viewPort: [Number],

    _player: {type: ObjectId, ref: "Player"},
    scores: Number
});

module.exports = mongoose.model("Game", GameSchema);