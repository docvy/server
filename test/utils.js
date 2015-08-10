/**
 * Test Utilities
 *
 * The MIT License (MIT)
 * Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
 */


"use strict";


exports = module.exports = {
  copyPlugins: copyPlugins,
};


// built-in modules
var fs = require("fs");
var path = require("path");


// npm-installed modules
var async = require("async");
var mkdirp = require("mkdirp");
var ncp = require("ncp").ncp;


// own modules
var utils = require("../lib/utils");


function copyPlugins(done) {
  var testPluginsPath = path.join(__dirname, "/data/plugins/");
  var plugins = fs.readdirSync(testPluginsPath);
  var srcPath, destPath;

  mkdirp.sync(utils.getPath("app.plugins"));
  async.each(plugins, function(name, next) {
    srcPath = path.join(testPluginsPath, name);
    destPath = path.join(utils.getPath("app.plugins"), name);
    if (fs.existsSync(destPath)) { return next(); }
    ncp(srcPath, destPath, function(err) {
      if (err) { throw new Error(); }
      return next();
    }); // ncp
  }, done);
}
