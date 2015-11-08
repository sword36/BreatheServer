/**
 * Created by USER on 02.11.2015.
 */
var $ = require("jQuery");
var Backbone = require("Backbone");
Backbone.$ = $;
var _ = require("underscore");
var Backgrid = require("Backgrid");
var formatter = require("../dateTimeFormatter");
var ClickableCell = require("./clickableCell");

var GameCollection = require("../collections/games");
var games = new GameCollection();

var formatterDateTime = _.extend({}, Backgrid.CellFormatter.prototype, {
    fromRaw: function(rawValue, model) {
        return formatter(new Date(rawValue));
    }
});



var columns = [{
    name: "_id",
    label: "ID",
    editable: false,
    cell: Backgrid.StringCell
}, {
    name: "start",
    label: "Начало",
    editable: false,
    cell: Backgrid.DatetimeCell,
    formatter: formatterDateTime
}, {
    name: "end",
    label: "Конец",
    editable: false,
    cell: Backgrid.DatetimeCell,
    formatter: formatterDateTime
}, {
    name: "pathView",
    label: "Путь",
    editable: false,
    cell: ClickableCell
}, {
    name: "collisionsCount",
    label: "Столкновения",
    editable: false,
    cell: ClickableCell
}, {
    name: "breatheAmount",
    label: "Величина дыхания",
    editable: false,
    cell: Backgrid.IntegerCell.extend({
        orderSeparator: ""
    })
}, {
    name: "scores",
    label: "Очки",
    editable: false,
    cell: Backgrid.IntegerCell.extend({
        orderSeparator: ""
    })
}, {
    name: "_player",
    label: "Пациент",
    editable: false,
    cell: Backgrid.StringCell
}];

var gamesGrid = new Backgrid.Grid({
    columns: columns,
    collection: games
});

$("#table").append(gamesGrid.render().el);

module.exports = gamesGrid;