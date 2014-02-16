var dbMysql = require("./dbMysql"),
    dbMssql = require("./dbMssql");

var db = module.exports = function (configuration) {
    this.sql = null;
    this.connection = null;
    this.config = configuration;

    console.log(configuration);

    if (configuration.type === "mysql") {
        this.sql = new dbMysql(configuration);
    }

    if (configuration.type === "mssql") {
        this.sql = dbMssql(configuration);
    }

    if ((this.sql === null) || (this.sql === undefined)){
        console.error("sql creation is failed!");
    }

    this.sql.connect();
}


db.prototype.showTables = function (callBack){
    this.sql.showTables(callBack);
}

db.prototype.columns = function (tableName) {
    return this.sql.columns(tableName);
}

db.prototype.tableComment = function (tableName) {
    return this.sql.tableComment(tableName, this.config.database);
};

db.prototype.foreignKeys = function (tableName) {
    return this.sql.foreignKeys(tableName);
};


db.prototype.connect = function (){
    this.sql.connect();
}

db.prototype.end = function (){
    this.sql.end();
}
