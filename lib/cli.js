/**
 * The Docvy Command-line runner
 *
 * The MIT License (MIT)
 * Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
 */


"use strict";


// built-in modules
var childProcess = require("child_process");
var path = require("path");


// npm-installed modules
var program = require("simple-argparse");
var out = require("cli-output");
var request = require("request").defaults({ json: true });
var utils = require("docvy-utils");


// own modules
var config = utils.loadConfig(path.join(__dirname, "config.json"));
var pkg = require("../package.json");


program
  .description(pkg.name, pkg.description)
  .version(pkg.version)
  .option("s", "start", "start server", startServer)
  .option("x", "stop", "stop server", stopServer)
  .option("t", "status", "show status of server", showStatus)
  .epilog("See https://github.com/docvy/app for feature requests and bug reports")
  .prerun(function() {
    if (this.debug) {
      process.env.DEBUG = (process.env.DEBUG ? process.env.DEBUG + "," : "") + "docvy:*";
    }
  })
  .parse();


/**
 * Start the server
 */
function startServer() {
  var port = this.port || config.server.port;
  var attach = this.attach || false;
  var script = [
    "var server = require('",
      path.join(__dirname, "server").replace(/\\/g, "/"),
    "');",
    "server.start(",
      JSON.stringify({ port: port }),
    ");",
  ].join("");
  out.log("starting server daemon");
  var child = childProcess.spawn("node", ["-e", script], {
    detached: !attach,
    stdio: attach ? "inherit" : "ignore",
    cwd: path.resolve("."),
  });
  if (!attach) {
    out.log("detaching daemon");
    child.unref();
  }
}


/**
 * Stop the server
 */
function stopServer() {
  var port = this.port || config.server.port;
  var url = "http://localhost:" + port + "/stop";
  request.del(url, function(error, res, body) {
    if (error) {
      if (error.code === "ECONNREFUSED") {
        return out.error("server not running");
      }
      return out.error("server stop failed: %s", error.code);
    }
    return out.success("server closing: %s", body.message);
  });
}


/**
 * Get status of server
 */
function showStatus() {
  var port = this.port || config.server.port;
  var url = "http://localhost:" + port;
  request.get(url, function(error) {
    if (error) {
      if (error.code === "ECONNREFUSED") {
        return out.error("server offline");
      }
      return out.error("error occurred: %j", error);
    }
    return out.success("server online");
  });
}
