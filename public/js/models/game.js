/**
 * Created by USER on 02.11.2015.
 */
var Backbone = require("Backbone");

var GameModel = Backbone.Model.extend({
    default: {
        start: new Date(),
        end: new Date(),
        path: [],
        collisions: [],
        breatheAmount: 0,
        viewPort: [],
        _player: 0,
        scores: 0
    },
    idAttribute: "_id",
    initialize: function(opts) {
        var collisionsCount = this.get("collisions").length;
        this.set("collisionsCount", "Столкновения: " + collisionsCount);

        var collisionsCountHref = "games/" + this.get("_id");
        if (collisionsCount != 0) {
            collisionsCountHref = ["games", this.get("_id"), "collisions"].join("/");
        }
        this.set("collisionsCountHref", collisionsCountHref);

        this.set("pathView", "Посмотреть путь");
        var pathHref = "games/" + this.get("_id");
        if (this.get("path") != null) {
            pathHref = ["games", this.get("_id"), "path"].join("/");
        }
        this.set("pathViewHref", pathHref);
    }
});

module.exports = GameModel;