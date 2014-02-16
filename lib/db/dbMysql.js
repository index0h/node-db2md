var mysql = require("mysql");

var dbMysql = module.exports = function dbMysql (config){
    console.log("Create mysql connection instance.");
    this.connection = mysql.createConnection(config);
}

dbMysql.prototype.connect = function (){
    this.connection.connect(function(error) {
        if ((error !== null) && (error !== undefined)){
            console.error(error);
            throw error;
        }

        console.log("The connect is success!")
    });
}

dbMysql.prototype.showTables = function (callBack){
    this.query("show tables", function (error, rows){
        if ((error !== null) && (error !== undefined)){
            console.log(error);
            throw error;
        }

        callBack(rows, null);
    });
}

dbMysql.prototype.columns = function (tableName){
    this.query("SHOW FULL COLUMNS FROM " + tableName, function (error, rows){
        if ((error !== null) && (error !== undefined)){
            console.log(error);
            throw error;
        }

        return rows;
    });
}

dbMysql.prototype.tableComment = function (tableName, database) {
    this.query( "SELECT TABLE_COMMENT " +
                "FROM `information_schema`.`tables` " +
                "WHERE table_schema = \'" + database +
                "\' AND table_name = \'" + tableName + "\'", function (error, result){
            if ((error !== null) && (error !== undefined)){
                console.log(error);
                throw error;
            }

            return result;
        });
};

dbMysql.prototype.foreignKeys = function (tableName) {
    this.query( "SELECT COLUMN_NAME, CONSTRAINT_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME " +
        "FROM information_schema.KEY_COLUMN_USAGE " +
        "WHERE TABLE_NAME = \'" + tableName + "\'", function (error, result){
        if ((error !== null) && (error !== undefined)){
            console.log(error);
            throw error;
        }

        return result;
    });
};

dbMysql.prototype.query = function (query, callBack){
    this.connection.query(query, function(error, rows, fields) {
        if ((error !== null) && (error !== undefined)){
            console.error(error);
            throw error;
        }

        var list = [];
        for (var i in rows) {
            list.push(rows[i][fields[0]["name"]]);
        }

        console.log(list);
        callBack(error, list);
    });
}

dbMysql.prototype.end = function (){
    console.log("End mysql connection.");
    this.connection.end();
}

//module.exports = dbMysql;
