var async = require("async"),
    fs = require("fs"),
    merge = require("deepmerge"),
    underscore = require("underscore");

/**
 * Main component, renders data from parser.
 * @param {Object} configuration
 */
var main = module.exports = function (configuration) {
    this.configuration = underscore.extend({
        header: "",
        footer: "",
        groups: {},
        tables: {},
        template: __dirname + "/template.md",
        user: null,
        pass: null,
        database: ""
    }, configuration);

    this.loader = new (require(__dirname + "/loader"))(configuration);
    this.parser = new (require(__dirname + "/parser"))(this.loader);
    this.template = underscore.template(fs.readFileSync(this.configuration.template, {encoding: "utf8"}));
};

/**
 * Loads and parses data from all tables.
 * @param {function} callBack Call back function.
 */
main.prototype.load = function (callBack) {
    var self = this,
        series = [
            function (seriesCallBack) {
                return self.loader.all(seriesCallBack);
            },
            function (seriesCallBack) {
                return self.parser.all(seriesCallBack);
            }
        ];

    async.series(series, callBack);
};

/**
 * Extending default table list data by parsed data.
 * @param {Object} tables List of table data.
 * @returns {Object}
 */
main.prototype.merge = function (tables) {
    var self = this;
    underscore.each(tables, function (value, key) {
        if ((self.parser[key] === null) && (self.parser[key] === undefined)) {
            console.error("Unknown table: " + key);
            return;
        }
        tables[key] = merge(tables[key], self.parser.data[key]);
    });

    return tables;
};

/**
 * Extending all tables information from configuration by parsed data.
 */
main.prototype.mergeAll = function () {
    var self = this,
        groups = self.configuration.groups;

    self.configuration.tables = this.merge(self.configuration.tables);

    underscore.each(groups, function (group, key) {
        groups[key].tables = self.merge(groups[key].tables);
    });
};

/**
 * Enter point.
 * @param {function} callBack Call back function.
 */
main.prototype.run = function (callBack) {
    var self = this;
    this.load(function (errors) {
        self.mergeAll();
        callBack(errors, self.template(self.configuration));
    });
};
