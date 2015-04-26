/**
* Test Utilties
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


"use strict";


// built-in modules
var fs = require("fs");


// npm-installed modules
var mkdirp = require("mkdirp");
var ncp = require("ncp").ncp;


// own modules
var utils = require("../lib/utils");


exports.copyPlugins = copyPlugins;
function copyPlugins(done) {
  var testPluginsPath = __dirname + "/data/plugins/";
  var plugins = fs.readdirSync(testPluginsPath);
  var numPlugins = 0;
  var srcPath, destPath;
  mkdirp.sync(utils.getPath("app.plugins"));
  plugins.forEach(function(plugin) {
    srcPath = testPluginsPath + plugin;
    destPath = utils.getPath("app.plugins") + "/" + plugin;
    if (fs.existsSync(destPath)) { return next(); }
    ncp(srcPath, destPath, function(err) {
      if (err) { throw new Error(); }
      return next();
    }); // ncp
  }); // plugins.forEach
  function next() {
    if (++numPlugins === plugins.length) { done(); }
  }
}

