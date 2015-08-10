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
var fbr = require("svc-fbr");
var installer = require("docvy-plugin-installer");


// own modules
var dplugins = require("./plugins");
var derrors = require("./errors");
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
  var options = _.merge(req.query, dutils.config);
  fbr.handle(options, function(err, descriptor) {
    if (err) {
      return res.json({ error: err });
    }
    if (!descriptor.isDirectory()) {
      return res.json({ error: new derrors.browse.NotADirectoryError() });
    }
    return res.json(descriptor);
  });
});


// Reading a file
app.get("/file/", function(req, res) {
  debug("reading file");
  var options = _.merge(req.query, dutils.config);
  var datatype = dutils.getDatatype(req.query.path);
  var expects = [ req.query.expects ];
  fbr.handle(options, function(err, descriptor) {
    if (err) {
      return res.json({ error: err });
    }

    if (!descriptor.isFile()) {
      return res.json({ error: new derrors.browse.NotAFileError() });
    }

    dplugins.handle(datatype, descriptor.content, expects, function(pluginErr, type, data) {
      if (pluginErr) {
        return res.json({ error: pluginErr });
      }
      return res.json({
        type: type,
        data: data,
      });
    });
  });
}); // app.get


// serving content from plugins directory
app.get("/plugins/www", express.static(dutils.getPath("app.plugins")));


// listing all plugins
app.get("/plugins/list", function(req, res) {
  debug("listing plugins");
  installer.listPlugins(function(err, info) {
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
  installer.npmInstall(pluginName, function(err) {
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
  installer.uninstall(pluginName, function(err) {
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
    if (_.isFunction(options)) {
      callback = options;
      options = { };
    } else {
      callback = dutils.defineCallback();
    }
  }
  options = _.merge({}, dutils.config.server, options);
  server.listen(options.port, function() {
    debug("server started at port %s", options.port);
    return callback();
  }).on("error", function(err) {
    debug("server errored: %j", err);
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
