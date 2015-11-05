/**
 * Created by USER on 02.11.2015.
 */
var $ = require("jQuery");
var Backbone = require("Backbone");
Backbone.$ = $;

var SessionModel = Backbone.Model.extend({
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