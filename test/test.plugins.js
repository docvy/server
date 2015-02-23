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


describe.only("dplugins.run()", function() {
  var testDatatype = "DocvyTestTypeRaw";
  var testExpects = ["DocvyTestTypeProcessed"];

  before(function(done) {
    // copying over all plugins
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


})(); // Wrapper
