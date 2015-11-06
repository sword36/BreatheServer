/**
 * Created by USER on 02.11.2015.
 */
var Backbone = require("Backbone");
var PageableCollection = require("backbone.paginator");
var GameModel = require("../models/game");

var GameCollection = PageableCollection.extend({
    model: GameModel,
    url: "http://localhost:3000/api/games",
    state: {
        pageSize: 10
    },
    mode: "client"
});

module.exports = GameCollection;