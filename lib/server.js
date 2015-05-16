/**
* The Docvy Server
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


"use strict";


// built-in modules
var http = require("http");


// npm-installed modules
var debug = require("debug")("docvy:server:server");
var express = require("express");
var lodash = require("lodash");


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
  var origin = req.param("origin") || "http://localhost:9999";
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


// Browsing files in the file system
app.get("/files/", function(req, res) {
  debug("reading directory");
  var _path = req.query.dirpath || process.cwd();
  var options = { };
  options.ignoreDotFiles = req.query.ignoreDotFiles ||
    dutils.getConfig("ignoreDotFiles");
  dreader.readdir(_path, options, function(err, files) {
    if (err) { return res.json({ error: err }); }
    return res.json(files);
  });
});


// Reading a file
app.get("/file/", function(req, res) {
  debug("reading file");
  var filepath = req.query.filepath;
  var expects = [req.query.expects];
  dreader.readfile(filepath, expects, function(err, _type, pData) {
    if (err) { return res.json({ error: err }); }
    return res.json({
      type: _type,
      data: pData
    }); // res.json
  }); // reader.readfile
}); // app.get


// serving content from plugins directory
app.get("/plugins/www",
  express.static(dutils.getPath("app.plugins")));


// listing all plugins
app.get("/plugins/list", function(req, res) {
  debug("listing plugins");
  dplugins.getPluginsInformation(function(err, info) {
    if (err) { return res.json({ error: err }); }
    return res.json({ plugins: info });
  });
});


// installing new plugins
app.post("/plugins/install/:pluginName", function(req, res) {
  var pluginName = req.params.pluginName;
  debug("installing plugin: %s", pluginName);
  dplugins.installPlugin(pluginName, function(err) {
    if (err) { return res.json({ error: err }); }
    return res.json({ installed: pluginName });
  });
});


// uninstalling plugins
app.delete("/plugins/uninstall/:pluginName", function(req, res) {
  var pluginName = req.params.pluginName;
  debug("uninstalling plugin: %s", pluginName);
  dplugins.uninstallPlugin(pluginName, function(err) {
    if (err) { return res.json({ error: err }); }
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
  res.send({ message: "acknowledged" });
});


// Spinning our server
exports.start = function(options, callback) {
  callback = (lodash.isFunction(callback)) ? callback
    : (lodash.isFunction(options)) ? options : dutils.defineCallback();
  options = (! lodash.isFunction(options)) ? options : undefined;
  options = dutils.getOptions("server", options);
  server.listen(options.port, function() {
    debug("server started");
    return callback();
  }).on("error", function(err) {
    debug("server errored");
    return callback(err);
  });
};


// Stopping server
exports.stop = stopServer;
function stopServer(callback) {
  callback = dutils.defineCallback(callback);
  server.close(function() {
    debug("server stopped");
    return callback();
  });
}

