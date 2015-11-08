/**
 * Created by USER on 02.11.2015.
 */
var $ = require("jQuery");
var Backbone = require("Backbone");
Backbone.$ = $;
var _ = require("underscore");
var Backgrid = require("Backgrid");

var PlayerCollection = require("../collections/players");
var players = new PlayerCollection();

var columns = [{
    name: "_id",
    label: "ID",
    editable: false,
    cell: Backgrid.StringCell
}, {
    name: "name",
    label: "Имя",
    editable: false,
    cell: Backgrid.StringCell
}, {
    name: "scores",
    label: "Очки",
    editable: false,
    cell: Backgrid.IntegerCell
},{
    name: "place",
    label: "Место",
    editable: false,
    cell: Backgrid.IntegerCell
}, {
    name: "hostComputer",
    label: "Номер компьютера",
    editable: false,
    cell: Backgrid.StringCell
}];

var playersGrid = new Backgrid.Grid({
    columns: columns,
    collection: players
});

$("#table").append(playersGrid.render().el);

module.exports = playersGrid;