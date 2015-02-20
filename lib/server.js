/**
* The Docvy Server
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


(function() {
"use strict";

// built-in modules
var http = require("http");
var path = require("path");


// npm-installed modules
var debug = require("debug")("docvy:server");
var express = require("express");
var lodash = require("lodash");


// own modules
var dfs = require("./fs");
var utils = require("./utils");


// module variables
var app = express();
var server = http.Server(app);


// Browsing files in the file system
app.get("/files/", function(req, res, next) {
  debug("reading directory");
  var _path = req.query.dirpath || process.cwd();
  dfs.readdir(_path, function(err, files) {
    if (err) { return next(err); }
    return res.json(files);
  });
});


// Reading a file
app.get("/file/", function(req, res, next) {
  debug("reading file");
  var filepath = req.query.filepath;
  var extname = path.extname(filepath);
  var accepts = utils.getAccepts(req.get("accept"));
  return res.json({accept: accept});
  dfs.readFile(filepath, function(err, data) {
    if (err) { return next(err); }
    dextensions.handle(accepts, data, function(err, _type,
    processedData) {
      if (err) { return next(err); }
      return res.json({
        data: processedData,
        type: _type
      });
    });
  });
});


// error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        error: {
          message: err.message
        }
    });
});


// Spinning our server
exports.start = function(options, callback) {
  callback = (lodash.isFunction(callback)) ? callback
    : (lodash.isFunction(options)) ? options : utils.defineCallback();
  options = (! lodash.isFunction(options)) ? options : undefined;
  options = utils.getOptions("server", options);
  server.listen(options.port, function() {
    debug("server started");
    callback();
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


// stopping server
app.delete("/stop", function(req, res) {
  stopServer();
  res.send({ message: "acknowledged" });
});


exports.app = app;
exports.server = server;

})();
