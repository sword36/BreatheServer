/**
 * Created by USER on 02.11.2015.
 */
var $ = require("jQuery");
var Backbone = require("Backbone");
Backbone.$ = $;

var SessionModel = Backbone.Model.extend({
    default: {
        start: new Date(),
        end: new Date(),
        hostComputer: 0,
        _games: []
    },
    idAttribute: "_id",
    initialize: function() {
        var gamesCount = this.get("_games").length;
        this.set("gamesCount", "Игры: " + gamesCount);
        var gamesUrl = "";
        if (gamesCount != 0) {
            gamesUrl = "games/" + this.get("_id");
        }
        this.set("href", gamesUrl);
    }
});

module.exports = SessionModel;