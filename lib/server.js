/**
* The Docvy Server
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


"use strict";


// built-in modules
var http = require("http");
var path = require("path");


// npm-installed modules
var debug = require("debug")("docvy:server");
var express = require("express");
var lodash = require("lodash");


// own modules
var cache = require("./cache");
var dfs = require("./fs");
var plugins = require("./plugins");
var utils = require("./utils");


// module variables
var app = express();
var server = http.Server(app);


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
app.get("/files/", function(req, res, next) {
  debug("reading directory");
  var _path = req.query.dirpath || process.cwd();
  var options = { };
  options.ignoreDotFiles = req.query.ignoreDotFiles ||
    utils.getConfig("ignoreDotFiles");
  dfs.readdir(_path, options, function(err, files) {
    if (err) { return next(err); }
    return res.json(files);
  });
});


// Reading a file
app.get("/file/", function(req, res, next) {
  debug("reading file");
  var filepath = req.query.filepath;
  var datatype = utils.getDatatype(path.extname(filepath));
  var expects = req.query.expects;
  cache.getData(filepath, expects, function(err, pData) {
    if (err) { /* ignore this error for now */ }
    if (pData) {
      return res.json({
        data: pData.data,
        type: pData.type
      });
    }
    dfs.readFile(filepath, function(err, data) {
      if (err) { return next(err); }
      plugins.handle(datatype, data, expects, function(err, _type,
      processedData) {
        if (err) { return next(err); }
        return res.json({
          data: processedData,
          type: _type
        }); // return res.json
      }); // dplugins
    }); // dfs.readFile
  }); // cache.getData
}); // app.get


// serving content from plugins directory
app.use("/plugins/www",
  express.static(utils.getPath("app.plugins")));


// listing all plugins
app.use("/plugins/list", function(req, res) {
  debug("listing plugins");
  plugins.getPluginsInformation(function(err, info) {
    if (err) { return res.json({ error: err }); }
    return res.json({ plugins: info });
  });
});


// installing new plugins
app.use("/plugins/install/:pluginName", function(req, res, next) {
  var pluginName = req.params.pluginName;
  debug("installing plugin: %s", pluginName);
  plugins.installPlugin(pluginName, function(err) {
    if (err) { return next(err); }
    return res.json({ installed: pluginName });
  });
});


// uninstalling plugins
app.use("/plugins/uninstall/:pluginName", function(req, res, next) {
  var pluginName = req.params.pluginName;
  debug("uninstalling plugin: %s", pluginName);
  plugins.uninstallPlugin(pluginName, function(err) {
    if (err) { return next(err); }
    return res.json({ uninstalled: pluginName });
  });
});


/**
* stopping server
*
* the server can not stop immediately. it only stops accepting new
* connections while servicing the live connections
*/
app.delete("/stop", function(req, res) {
  stopServer(); // defined later
  res.send({ message: "acknowledged" });
});


// Spinning our server
exports.start = function(options, callback) {
  callback = (lodash.isFunction(callback)) ? callback
    : (lodash.isFunction(options)) ? options : utils.defineCallback();
  options = (! lodash.isFunction(options)) ? options : undefined;
  options = utils.getOptions("server", options);
  server.listen(options.port, function() {
    debug("server started");
    return callback();
  }).on("error", function() {
    return callback();
  });
};


// Stopping server
exports.stop = exports.close = stopServer;
function stopServer(callback) {
  callback = utils.defineCallback(callback);
  server.close(function() {
    debug("server stopped");
    callback();
  });
}


exports.app = app;
exports.server = server;
