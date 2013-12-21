var async = require("async"),
    underscore = require("underscore"),
    Sequelize = require("sequelize");

/**
 * Main component, loads data from MySQL.
 * @param {Object} configuration
 */
var loader = module.exports = function (configuration) {
    this.sequelize = new Sequelize(
        configuration.database,
        configuration.user,
        configuration.pass,
        {logging: false}
    );
    this.data = {};
};

/**
 * Internal helper.
 * @param {string} sql    SQL code to execution.
 * @param {Object} params List of parameters that mast be placed in SQL.
 * @param {string} field  Name of data[tableName] field, where result must be stored.
 * @returns {Function}
 */
loader.prototype.query = function (sql, params, field) {
    var self = this;
    self.data[params.tableName] = self.data[params.tableName] || {};

    return function (callBack) {
        self.sequelize
            .query(sql, null, {raw: true}, params)
            .success(function (fields) {
                self.data[params.tableName][field] = fields;
                callBack(null, fields);
            })
            .error(function (errors) {
                callBack(errors, null);
            });
    };
};

/**
 * Read columns from table.
 * @param {string} tableName Name of table.
 * @returns {Function}
 */
loader.prototype.columns = function (tableName) {
    return this.query("SHOW FULL COLUMNS FROM `" + tableName + "`;", {tableName: tableName}, "columns");
};

/**
 * Read comment to table.
 * @param {string} tableName Name of table.
 * @returns {Function}
 */
loader.prototype.tableComment = function (tableName) {
    var self = this;

    return this.query(
        "SELECT TABLE_COMMENT " +
            "FROM `information_schema`.`tables` " +
            "WHERE table_schema = :database AND table_name = :tableName;",
        {tableName: tableName, database: self.sequelize.config.database},
        "tableComment"
    );
};

/**
 * Read foreign keys data from table.
 * @param {string} tableName Name of table.
 * @returns {Function}
 */
loader.prototype.foreignKeys = function (tableName) {
    return this.query(
        "SELECT COLUMN_NAME, CONSTRAINT_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME " +
            "FROM information_schema.KEY_COLUMN_USAGE " +
            "WHERE TABLE_NAME = :tableName",
        {tableName: tableName},
        "foreignKeys"
    );
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
    this.sequelize.getQueryInterface().showAllTables()
        .success(function (tableList) {
            underscore.each(tableList, function (name) {
                self.data[name] = self.data[name] || {};
            });
            callBack(null, tableList);
        })
        .error(function (errors) {
            callBack(errors, null);
        });
};

/**
 * Read all information to every table in database.
 * @param {Function} callBack Call back function.
 */
loader.prototype.all = function (callBack) {
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
