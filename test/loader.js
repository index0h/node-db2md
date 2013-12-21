require("should");

var assert = require("assert"),
    expected = require(__dirname + "/expected.json").loader,
    Loader = require(__dirname + "/../lib" + ((process.env.DOC_MY_DB_COVERAGE === "1") ? "-cov" : "") + "/loader"),
    loader = new Loader({
        user: "travis",
        pass: null,
        database: "docMyDB"
    });

describe("loader", function () {
    describe("columns", function () {
        it("should be right columns from table", function (callBack) {
            loader.columns("folder")(function (errors, fields) {
                assert.strictEqual(null, errors);
                fields.should.be.eql(expected.folder.columns);
                loader.data.folder.columns.should.be.eql(expected.folder.columns);
                callBack();
            });
        });
    });

    describe("tableComment", function () {
        it("should be right comment of table", function (callBack) {
            loader.tableComment("folder")(function (errors, fields) {
                assert.strictEqual(null, errors);
                fields.should.be.eql(expected.folder.tableComment);
                loader.data.folder.tableComment.should.be.eql(expected.folder.tableComment);
                callBack();
            });
        });
    });

    describe("foreignKeys", function () {

        it("should be right foreign keys information of table", function (callBack) {
            loader.foreignKeys("folder")(function (errors, fields) {
                assert.strictEqual(null, errors);
                fields.should.be.eql(expected.folder.foreignKeys);
                loader.data.folder.foreignKeys.should.be.eql(expected.folder.foreignKeys);
                callBack();
            });
        });
    });

    describe("table", function () {
        it("should all right data of table", function (callBack) {
            loader.data = {};
            loader.table("folder", function (errors) {
                assert.strictEqual(null, errors);
                loader.data.should.be.eql(expected);
                callBack();
            });
        });
    });

    describe("list", function () {
        it("should find only one table 'folder'", function (callBack) {
            var expected = ["folder"];
            loader.list(function (errors, tableList) {
                assert.strictEqual(null, errors);
                tableList.should.be.eql(expected);
                callBack();
            });
        });
    });

    describe("all", function () {
        it("should load all data to all tables", function (callBack) {
            loader.data = {};
            loader.all(function (errors) {
                assert.strictEqual(null, errors);
                loader.data.should.be.eql(expected);
                callBack();
            });
        });
    });
});