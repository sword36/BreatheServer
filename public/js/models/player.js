/**
 * Created by USER on 02.11.2015.
 */
var Backbone = require("Backbone");

var PlayerModel = Backbone.Model.extend({
    default: {
        name: "player",
        scores: 0,
        hostComputer: "0",
        place: 0
    },
    idAttribute: "_id",
    initialize: function(opts) {

    }
});

module.exports = PlayerModel;