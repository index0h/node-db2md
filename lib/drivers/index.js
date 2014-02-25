var driver = module.exports = function (configuration) {
    this.sql = null;
    this.connection = null;
    this.config = configuration;

    if (["mssql", "mysql"].indexOf(configuration.type) === -1) {
        throw new Error("Unknown connection type '" + configuration.type + "'");
    }

    this.sql = new (require("./" + configuration.type))(configuration);

    this.sql.connect();
};

driver.prototype.showTables = function (callBack) {
    this.sql.showTables(callBack);
};

driver.prototype.columns = function (tableName) {
    return this.sql.columns(tableName);
};

driver.prototype.tableComment = function (tableName) {
    return this.sql.tableComment(tableName, this.config.database);
};

driver.prototype.foreignKeys = function (tableName) {
    return this.sql.foreignKeys(tableName);
};

driver.prototype.connect = function () {
    this.sql.connect();
};

driver.prototype.end = function () {
    this.sql.end();
};
