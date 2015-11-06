/**
 * Created by USER on 02.11.2015.
 */
var Backbone = require("Backbone");

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
        var gamesCountHref = ["sessions", this.get("_id")].join("/");
        if (gamesCount != 0) {
            gamesCountHref = ["games", this.get("_games")[0]].join("/"); //first game id
        }
        this.set("gamesCountHref", gamesCountHref);
    }
});

module.exports = SessionModel;