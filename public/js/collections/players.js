/**
 * Created by USER on 02.11.2015.
 */
var Backbone = require("Backbone");
var PageableCollection = require("backbone.paginator");
var PlayerModel = require("../models/player");

var PlayerCollection = PageableCollection.extend({
    model: PlayerModel,
    url: "http://localhost:3000/api/players",
    state: {
        pageSize: 10
    },
    mode: "client"
});

module.exports = PlayerCollection;