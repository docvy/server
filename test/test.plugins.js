/**
* Tests aganst The Docvy Plugins loader
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


// Silence jshint about mocha's global vars
/* global describe, it, before */


(function() {
"use strict";


// built-in modules
var fs = require("fs");


// npm-installed modules
var mkdirp = require("mkdirp");
var ncp = require("ncp").ncp;
var should = require("should");


// own modules
var dplugins = require("../lib/plugins");
var utils = require("../lib/utils");


// copying over all test plugins
before(function(done) {
  var testPluginsPath = __dirname + "/mock/plugins/";
  var plugins = fs.readdirSync(testPluginsPath);
  var num_plugins = 0, destPath;
  mkdirp.sync(utils.getPath("app.plugins"));
  plugins.forEach(function(plugin) {
    destPath = utils.getPath("app.plugins") + "/" + plugin;
    if (fs.existsSync(destPath)) { return done(); }
    ncp(testPluginsPath + plugin, destPath, function(err) {
      if (err) { return done(err); }
      if (++num_plugins === plugins.length) { done(); }
    }); // ncp
  }); // plugins.forEach
}); // before


describe("dplugins.run()", function() {
  var testDatatype = "DocvyTestTypeRaw";
  var testExpects = ["DocvyTestTypeProcessed"];

  it("runs a plugin", function(done) {
    var data = "some data for me";
    dplugins.handle(testDatatype, data, testExpects, function(err,
    _type, pData) {
      should(err).not.be.ok;
      _type.should.be.ok;
      pData.should.be.ok;
      done();
    });
  });

  it("passes an error if no extension can handle type", function(done) {
    var expects = ["NonExistingType"];
    var data = "blah blah";
    dplugins.handle(testDatatype, data, expects, function(err) {
      err.should.be.ok;
      done();
    });
  });

  it("passes an error if plugin hangs");

});


describe("dplugins.getPluginsInformation()", function() {

  it("passes an array of information", function(done) {
    dplugins.getPluginsInformation(function(err, pluginsInfo) {
      pluginsInfo.should.be.an.Array;
      done();
    });
  });

  it("each info object must have a name", function(done) {
    var plugin_dirs = fs.readdirSync(utils.getPath("app.plugins"));
    var num_plugins = plugin_dirs.length;
    dplugins.getPluginsInformation(function(err, pluginsInfo) {
      pluginsInfo.forEach(function(pluginInfo) {
        should(pluginInfo.name).be.ok;
        if (--num_plugins === 0) { return done(); }
      });
    });
  });

});


})(); // Wrapper
