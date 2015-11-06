/**
 * Created by USER on 31.10.2015.
 */
var _ = require("underscore");
var $ = require("jQuery");
var Backbone = require("Backbone");
Backbone.$ = $;
Backbone.PageableCollection = require("backbone.paginator");
var Backgrid = require("Backgrid");

var sessionsView = require("./views/sessions");
//var gamesView = require("./views/games");

$(function() {
    // gamesView.collection.fetch({reset: true});
    sessionsView.collection.fetch({reset: true});

});
