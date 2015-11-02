/**
 * Created by USER on 02.11.2015.
 */
var $ = require("jQuery");
var Backbone = require("Backbone");
Backbone.$ = $;

var SessionModel = Backbone.Model.extend({
    idAttribute: "_id"
});

module.exports = SessionModel;