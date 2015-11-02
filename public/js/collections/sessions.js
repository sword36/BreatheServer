/**
 * Created by USER on 02.11.2015.
 */
var $ = require("jQuery");
var Backbone = require("Backbone");
Backbone.$ = $;

var PageableCollection = require("backbone.paginator");
var SessionModel = require("../models/session");

var SessionCollection = PageableCollection.extend({
    model: SessionModel,
    url: "http://localhost:3000/api/sessions",
    state: {
        pageSize: 10
    },
    mode: "client"
});

module.exports = SessionCollection;