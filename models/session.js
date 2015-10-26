var mongoose = require("mongoose");

var ObjectId = mongoose.Schema.Types.ObjectId;

var SessionSchema = mongoose.Schema({
  start: Date,
  end: Date,
  hostComputer: String,

  _games: [{type: ObjectId, ref: "Game"}]
});

module.exports = mongoose.model("Session", SessionSchema);