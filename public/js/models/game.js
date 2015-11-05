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
    initialize: function() {

    }
});

module.exports = GameModel;