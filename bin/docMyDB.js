#!/usr/bin/env node

var program = require("commander"),
    main,
    Main = require(__dirname + "/../lib/main");

program
    .version(require(__dirname + "/../package.json").version)
    .option("-c, --config [path]", "Path to configuration file", process.cwd() + "/docMyDB.json")
    .parse(process.argv);

main = new Main(require(program.config));

main.run(function (errors, data) {
    console.log(data);
});