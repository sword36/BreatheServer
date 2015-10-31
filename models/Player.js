/**
 * Created by USER on 26.10.2015.
 */
var mongoose = require("mongoose");

var PlayerSchema = mongoose.Schema({
    name: String,
    scores: Number,
    hostComputer: String,
    place: Number
});

module.exports = mongoose.model("Player", PlayerSchema);