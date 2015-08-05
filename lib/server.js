/**
 * The Docvy Server
 *
 * The MIT License (MIT)
 * Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
 */


"use strict";


exports = module.exports = {
  start: startServer,
  stop: stopServer,
};


// built-in modules
var http = require("http");


// npm-installed modules
var _ = require("lodash");
var debug = require("debug")("docvy:server:server");
var express = require("express");


// own modules
var dplugins = require("./plugins");
var dreader = require("./reader");
var dutils = require("./utils");


// module variables
var app = express();
var server = http.Server(app);


// setting title of the process
// process.title = "docvy-server";


// Setting headers
app.use(function(req, res, next) {
  debug("setting headers");
  var origin = req.query.origin || "http://localhost:9999";
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  return next();
});


// Browsing files in the file system
app.get("/files/", function(req, res) {
  debug("reading directory");
  var _path = req.query.dirpath || process.cwd();
  var options = _.merge(req.query, dutils.config);
  dreader.readdir(_path, options, function(err, files) {
    if (err) {
      return res.json({ error: err });
    }
    return res.json(files);
  });
});


// Reading a file
app.get("/file/", function(req, res) {
  debug("reading file");
  var filepath = req.query.filepath;
  var expects = [ req.query.expects ];
  dreader.readfile(filepath, expects, function(err, _type, pData) {
    if (err) {
      return res.json({ error: err });
    }
    return res.json({
      type: _type,
      data: pData,
    }); // res.json
  }); // reader.readfile
}); // app.get


// serving content from plugins directory
app.get("/plugins/www", express.static(dutils.getPath("app.plugins")));


// listing all plugins
app.get("/plugins/list", function(req, res) {
  debug("listing plugins");
  dplugins.getPluginsInformation(function(err, info) {
    if (err) {
      return res.json({ error: err });
    }
    return res.json({ plugins: info });
  });
});


// installing new plugins
app.post("/plugins/install/:pluginName", function(req, res) {
  var pluginName = req.params.pluginName;
  debug("installing plugin: %s", pluginName);
  dplugins.installPlugin(pluginName, function(err) {
    if (err) {
      return res.json({ error: err });
    }
    return res.json({ installed: pluginName });
  });
});


// uninstalling plugins
app.delete("/plugins/uninstall/:pluginName", function(req, res) {
  var pluginName = req.params.pluginName;
  debug("uninstalling plugin: %s", pluginName);
  dplugins.uninstallPlugin(pluginName, function(err) {
    if (err) {
      return res.json({ error: err });
    }
    return res.json({ uninstalled: pluginName });
  });
});


/**
* stopping server
*
* the server does not stop immediately. it only stops accepting new
* connections while servicing the live connections
*/
app.delete("/stop", function(req, res) {
  debug("stopping server");
  stopServer(); // defined later, hoisted from the bottom
  return res.send({ message: "acknowledged" });
});


// Spinning our server
function startServer(options, callback) {
  if (!callback) {
    callback = _.isFunction(options) ? callback : dutils.defineCallback();
    options = _.isFunction(options) ? { } : options;
  }
  options = _.merge(options, dutils.config.server);
  server.listen(options.port, function() {
    debug("server started");
    return callback();
  }).on("error", function(err) {
    debug("server errored");
    return callback(err);
  });
}


// Stopping server
function stopServer(callback) {
  callback = dutils.defineCallback(callback);
  server.close(function() {
    debug("server stopped");
    return callback();
  });
}
