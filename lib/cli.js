// npm-installed modules
// var debug = require("debug")("docvy:cli");
var program = require("commander");


program
  .version(require("../package.json").version)
  .option("-p, --port <num>", "Start server at port <num>")
  .parse(process.argv);
