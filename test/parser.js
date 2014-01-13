require("should");

var assert = require("assert"),
    expected = require(__dirname + "/expected.json"),
    loader = {data: expected.loader},
    Parser = require(__dirname + "/../lib" + ((process.env.DB2MD_COVERAGE === "1") ? "-cov" : "") + "/parser"),
    parser = new Parser(loader);

expected = expected.parser;

describe("parser", function () {
    describe("columns", function () {
        parser.data = {};
        it("should be right columns from loader", function (callBack) {
            parser.columns("folder")(function (errors, fields) {
                assert.strictEqual(null, errors);
                fields.should.be.eql(expected.columns);
                parser.data.folder.columns.should.be.eql(expected.columns);
                callBack();
            });
        });
    });

    describe("comment", function () {
        parser.data = {};
        it("should be right table comment from loader", function (callBack) {
            parser.comment("folder")(function (errors, fields) {
                assert.strictEqual(null, errors);
                fields.should.be.eql(expected.comment);
                parser.data.folder.comment.should.be.eql(expected.comment);
                callBack();
            });
        });
    });

    describe("foreignKeys", function () {
        parser.data = {};
        it("should be right foreign keys from loader", function (callBack) {
            parser.foreignKeys("folder")(function (errors, fields) {
                assert.strictEqual(null, errors);
                fields.should.be.eql(expected.foreignKeys);
                parser.data.folder.foreignKeys.should.be.eql(expected.foreignKeys);
                callBack();
            });
        });
    });

    describe("convert", function () {
        parser.data = {
            table: "",
            columns: expected.columns,
            foreignKeys: expected.foreignKeys
        };
        it("should be right markdown table", function (callBack) {
            parser.convert("folder")(function (errors, table) {
                assert.strictEqual(null, errors);
                table.should.be.eql(expected.table);
                parser.data.folder.table.should.be.eql(expected.table);
                callBack();
            });
        });
    });

    describe("table", function () {
        parser.data = {};
        it("should be right parse every data of table", function (callBack) {
            parser.table("folder", function (errors) {
                assert.strictEqual(null, errors);
                parser.data.folder.should.be.eql(expected);
                callBack();
            });
        });
    });

    describe("all", function () {
        it("should parse all data to all tables", function (callBack) {
            parser.data = {};
            parser.loader.list = function (callBack) {
                callBack(null, ["folder"]);
            };
            parser.all(function (errors) {
                assert.strictEqual(null, errors);
                parser.data.should.be.eql({folder: expected});
                callBack();
            });
        });
    });
});