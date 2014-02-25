var mysql = require("mysql");

var driver = module.exports = function dbMysql(config) {
    console.log("Create mysql connection instance.");
    this.connection = mysql.createConnection(config);
};

driver.prototype.connect = function () {
    this.connection.connect(function (error) {
        if ((error !== null) && (error !== undefined)) {
            console.error(error);
            throw error;
        }

        console.log("The connect is success!");
    });
};

driver.prototype.showTables = function (callBack) {
    this.query("show tables", function (error, rows) {
        if ((error !== null) && (error !== undefined)) {
            console.log(error);
            throw error;
        }

        callBack(rows, null);
    });
};

driver.prototype.columns = function (tableName) {
    this.query("SHOW FULL COLUMNS FROM " + tableName, function (error, rows) {
        if ((error !== null) && (error !== undefined)) {
            console.log(error);
            throw error;
        }

        return rows;
    });
};

driver.prototype.tableComment = function (tableName, database) {
    this.query("SELECT TABLE_COMMENT " +
        "FROM `information_schema`.`tables` " +
        "WHERE table_schema = \'" + database +
        "\' AND table_name = \'" + tableName + "\'", function (error, result) {
        if ((error !== null) && (error !== undefined)) {
            console.log(error);
            throw error;
        }

        return result;
    });
};

driver.prototype.foreignKeys = function (tableName) {
    this.query("SELECT COLUMN_NAME, CONSTRAINT_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME " +
        "FROM information_schema.KEY_COLUMN_USAGE " +
        "WHERE TABLE_NAME = \'" + tableName + "\'", function (error, result) {
        if ((error !== null) && (error !== undefined)) {
            console.log(error);
            throw error;
        }

        return result;
    });
};

driver.prototype.query = function (query, callBack) {
    this.connection.query(query, function (error, rows, fields) {
        if ((error !== null) && (error !== undefined)) {
            console.error(error);
            throw error;
        }

        var list = [];
        rows.forEach(function (value) {
            list.push(value[fields[0]["name"]]);
        });

        callBack(error, list);
    });
};

driver.prototype.end = function () {
    console.log("End mysql connection.");
    this.connection.end();
};
