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


// own modules
var config = require("./config.json");
var pkg = require("../package.json");


/**
 * @todo allow debug output
 */
program
  .description("The Docvy Server")
  .version(pkg.version)
  .option("start", "start server", startServer)
  .option("stop", "stop server", stopServer)
  .option("status", "show status of server", showStatus)
  .epilog("See " + pkg.homepage + " for feature requests and bug reports")
  .parse();



function startServer() {
  var port = this.port || config.server.port;
  var attach = this.attach || false;
  var script = [
    "var server = require('",
      path.join(__dirname, "server").replace(/\\/g, "/"),
    "');",
    "server.start(",
      JSON.stringify({ port: port }),
    ")",
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


function stopServer() {
  var port = this.port || config.port;
  var url = "http://localhost:" + port + "/stop";
  request.del(url, function(error, res, body) {
    if (error || res.statusCode !== 200) {
      var errorCode = error ? error.code : body;
      return out.error("server stop failed: %s", errorCode);
    }
    return out.success("server closing: %s", body.message);
  });
}


// get status of server
function showStatus() {
  var port = this.port || config.port;
  var url = "http://localhost:" + port;
  request.get(url, function(error) {
    if (error) {
      return out.error("server offline");
    }
    return out.success("server online");
  });
}
