/**
* The Docvy Command-line runner
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/

(function() {
"use strict";

// built-in modules
var childProcess = require('child_process');
var path = require("path");


// npm-installed modules
var cli = require("commander");
var logger = require("custom-logger").config({
  format: "[%event%]%padding%%message%"
});


// own modules
var request = require("request").defaults({json: true});


// module variables
var config = require("../lib/config.json");
var options = {};


// command-line interface definition
cli
  .version(require("../package.json").version)
  .option("-p, --port <num>", "Start server at port <num>")
  .option("-a, --attach", "Attach server process")
  .option("-s, --start", "Start server")
  .option("-x, --stop", "Stop server")
  .option("-d, --debug", "Output debug information")
  .parse(process.argv);


// getting options
options.port = cli.port || config.server.port;


// show debug information
if (cli.debug) {
  process.env.DEBUG = process.env.DEBUG
    ? process.env.DEBUG + ", docvy:*"
    : "docvy:*";
  logger.info("debug output enabled");
}


// start server as a daemon
if (cli.start) {
  // determining daemon configuration
  var _stdio = "ignore";
  var _detached = true;
  if (cli.attach) {
    _detached = false;
    _stdio = "inherit";
  }
  var script = " "
    + " var server = require(\"./lib/server\"); "
    + " server.start(" + JSON.stringify(options) + "); "
    + " ";
  var child = childProcess.spawn("node", ["-e", script], {
    detached: _detached,
    stdio: _stdio,
    cwd: path.resolve(".")
  });
  if (! cli.attach) { child.unref(); }
  logger.info("server daemon started");
}


// stop server
if (cli.stop) {
  var port = cli.port || config.server.port;
  request.del("http://localhost:" + port + "/stop", function(error, res, body) {
    if (error || res.statusCode !== 200) {
      return logger.error("server stop failed: %s", error.code || body.error.code);
    }
    return logger.info("server asked to close");
  });
}

})();
