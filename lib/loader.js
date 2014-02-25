var async = require("async"),
    underscore = require("underscore");

/**
 * Main component, loads data from MySQL.
 * @param {Object} configuration
 */
var loader = module.exports = function (configuration) {
    console.log("loader.exports");
    this.driver = new (require("./drivers"))(configuration);
    this.data = {};
};

/**
 * Read columns from table.
 * @param {string} tableName Name of table.
 * @returns {Function}
 */
loader.prototype.columns = function (tableName) {
    return this.driver.columns(tableName);
};

/**
 * Read comment to table.
 * @param {string} tableName Name of table.
 * @returns {Function}
 */
loader.prototype.tableComment = function (tableName) {
    return this.driver.tableComment(tableName);
};

/**
 * Read foreign keys data from table.
 * @param {string} tableName Name of table.
 * @returns {Function}
 */
loader.prototype.foreignKeys = function (tableName) {
    return this.driver.foreignKeys(tableName);
};

/**
 * Read information about columns, foreign keys and table comment.
 * @param {string}   tableName Name of table.
 * @param {Function} callBack  Call back function.
 */
loader.prototype.table = function (tableName, callBack) {
    var series = [
        this.columns(tableName),
        this.tableComment(tableName),
        this.foreignKeys(tableName)
    ];

    async.series(series, callBack);
};

/**
 * Read list of tables in database.
 * @param {Function} callBack Call back function.
 */
loader.prototype.list = function (callBack) {
    var self = this;
    console.log("loader.list");
    this.driver.showTables(function (list, error) {
        if ((error !== null) && (error !== undefined)) {
            console.error(error);
            throw error;
        }

        underscore.each(list, function (name) {
            self.data[name] = self.data[name] || {};
        });

        callBack(null, list);
    });
};

/**
 * Read all information to every table in database.
 * @param {Function} callBack Call back function.
 */
loader.prototype.all = function (callBack) {
    console.log("loader.all");
    var self = this,
        iterator = function (tableName, callBack) {
            self.table(tableName, callBack);
        };
    this.list(function (errors, list) {
        if ((errors !== null) && (errors !== undefined)) {
            console.error(errors);
        }
        async.each(list, iterator, callBack);
    });
};
