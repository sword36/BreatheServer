/**
 * Created by USER on 05.11.2015.
 */
var $ = require("jQuery");
var Backbone = require("Backbone");
Backbone.$ = $;
var Backgrid = require("Backgrid");

var ClickableCell = Backgrid.Cell.extend({
    formatter: Backgrid.StringFormatter,

    render: function () {
        this.$el.empty();
        var model = this.model;
        //var formattedValue = this.formatter.fromRaw(model.get(this.column.get("name")), model);
        var value = model.get(this.column.get("name"));
        var hrefName = model.get("hrefName");
        var href = model.get(hrefName);
        if (href) {
            this.$el.append($("<a>", {
                tabIndex: -1,
                href: "#" + href,
                title: value
            }).text(value));
        } else {
            this.$el.text(value);
        }

        this.delegateEvents();
        return this;
    },

    initialize: function(opts) {
        Backgrid.Cell.prototype.initialize.apply(this, arguments);
        this.model = opts.model;
        this.column = opts.column;

        var hrefName = opts.column.get("name");
        this.model.set("hrefName", hrefName + "Href");
    }
});

module.exports = ClickableCell;