var async = require("async"),
    Table = require("cli-table"),
    merge = require("deepmerge"),
    underscore = require("underscore");

/**
 * Main component, parses data stored in loader.
 * @param {Object} configuration
 */
var parser = module.exports = function (loader) {
    this.loader = loader;
    this.data = {};
};

/**
 * Initialisation of table data.
 * @param {string} tableName Name fo table.
 */
parser.prototype.initTable = function (tableName) {
    this.data[tableName] = this.data[tableName] || {
        "comment": {},
        "columns": {},
        "foreignKeys": {},
        "table": ""
    };
};

/**
 * Parses columns from loader.
 * @param {string} tableName Name fo table.
 * @returns {Function}
 */
parser.prototype.columns = function (tableName) {
    var self = this;
    this.initTable(tableName);
    return function (callBack) {
        self.data[tableName].columns = {};
        underscore.each(self.loader.data[tableName].columns, function (column) {
            self.data[tableName].columns[column["Field"]] = {
                field: column["Field"],
                type: column["Type"],
                collation: (underscore.isNull(column["Collation"]) === false) ? column["Collation"] : "",
                null: (column["Null"] === "NO") ? "" : "YES",
                default: (underscore.isNull(column["Default"]) === false) ? column["Default"] : "",
                extra: [column["Extra"]],
                key: "",
                comment: column["Comment"].replace(/([^\n]+)\n.+/g, "$1")
            };
        });

        callBack(null, self.data[tableName].columns);
    };
};

/**
 * Parses table comment from loader.
 * @param {string} tableName Name fo table.
 * @returns {Function}
 */
parser.prototype.comment = function (tableName) {
    var self = this;
    this.initTable(tableName);
    return function (callBack) {
        self.data[tableName]["comment"] = self.loader.data[tableName].tableComment[0]["TABLE_COMMENT"];

        callBack(null, self.data[tableName].comment);
    };
};

/**
 * Parses foreign keys from loader.
 * @param {string} tableName Name fo table.
 * @returns {Function}
 */
parser.prototype.foreignKeys = function (tableName) {
    var self = this;
    this.initTable(tableName);
    return function (callBack) {
        underscore.each(self.loader.data[tableName].foreignKeys, function (column) {
            var link,
                columnName = column["CONSTRAINT_NAME"];

            if (column["REFERENCED_TABLE_NAME"] !== null) {
                link = "->" + column["REFERENCED_TABLE_NAME"];

                if (column["REFERENCED_COLUMN_NAME"] !== "id") {
                    link += "." + column["REFERENCED_COLUMN_NAME"];
                }

                columnName += link;
            }

            self.data[tableName].foreignKeys[column["COLUMN_NAME"]] = {key: columnName};
        });

        callBack(null, self.data[tableName].foreignKeys);
    };
};

/**
 * Converts columns and foreign keys data to markdown table.
 * @param {string} tableName Name fo table.
 * @returns {Function}
 */
parser.prototype.convert = function (tableName) {
    var self = this,
        fields = ["field", "type", "key", "extra", "null", "default", "collation", "comment"],
        table = new Table({
            head: fields,
            chars: {
                "top": "",
                "top-mid": "",
                "top-left": "",
                "top-right": "",
                "bottom": "",
                "bottom-mid": "",
                "bottom-left": "",
                "bottom-right": "",
                "left": "|",
                "left-mid": "|",
                "mid": "-",
                "mid-mid": "|",
                "right": "|",
                "right-mid": "|",
                "middle": ""
            },
            style: {
                "padding-left": 1,
                "padding-right": 1,
                "compact": true
            }
        });
    return function (callBack) {
        var data = merge(self.data[tableName].columns, self.data[tableName].foreignKeys);

        underscore.each(data, function (value) {
            var row = underscore.pick(value, fields);

            if (row.extra !== undefined) {
                row.extra = row.extra.join(" ");
                table.push(underscore.values(row));
            }
        });

        self.data[tableName].table = table.toString();
        callBack(null, self.data[tableName].table);
    };
};

/**
 * Parses all data of table.
 * @param {string}   tableName Name fo table.
 * @param {Function} callBack  Call back function.
 */
parser.prototype.table = function (tableName, callBack) {
    var series = [
        this.comment(tableName),
        this.columns(tableName),
        this.foreignKeys(tableName),
        this.convert(tableName)
    ];

    async.series(series, function (errors) {
        callBack(errors);
    });
};

/**
 * Parses all information to every table in database.
 * @param {Function} callBack Call back function.
 */
parser.prototype.all = function (callBack) {
    var self = this,
        iterator = function (tableName, callBack) {
            self.table(tableName, callBack);
        };
    this.loader.list(function (errors, list) {
        if ((errors !== null) && (errors !== undefined)) {
            console.error(errors);
        }
        async.each(list, iterator, callBack);
    });
};
