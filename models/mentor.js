/**
 * Created by USER on 26.10.2015.
 */
var mongoose = require("mongoose");

var ObjectId = mongoose.Schema.Types.ObjectId;

var MentorSchema = mongoose.Schema({
    name: String,
    surname: String,
    login: String,
    password: Number,

    _players: [{type: ObjectId, ref: "Player"}]
});

module.exports = mongoose.model("Mentor", MentorSchema);