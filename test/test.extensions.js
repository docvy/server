/**
* Tests aganst The Docvy Extensions loader
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
var dextensions = require("../lib/extensions");


describe("dextensions.extDir()", function() {

  it("returns directory for extensions", function() {
    var dir = dextensions.extDir();
    dir.should.be.a.String;
  });

});


describe.only("dextensions.run()", function() {
  var testAccepts = ["DocvyTestType"];

  before(function(done) {
    // copying over all extensions
    var testExtensionsPath = __dirname + "/mock/extensions/";
    var extensions = fs.readdirSync(testExtensionsPath);
    var num_extensions = 0, destPath;
    mkdirp.sync(dextensions.extDir());
    extensions.forEach(function(extension) {
      destPath = dextensions.extDir() + "/" + extension;
      if (fs.existsSync(destPath)) { return done(); }
      ncp(testExtensionsPath + extension, destPath, function(err) {
        if (err) { return done(err); }
        if (++num_extensions === extensions.length) { done(); }
      });
    });
  });

  it("runs an extension for a given type", function(done) {
    var data = "some data for me";
    dextensions.handle(testAccepts, data, function(err, _type,
    pData) {
      should(err).not.be.ok;
      _type.should.be.ok;
      pData.should.be.ok;
      done();
    });
  });

  it("passes an error if no extension can handle type", function(done) {
    var accepts = ["NonExistingType"];
    var data = "blah blah";
    dextensions.handle(accepts, data, function(err) {
      err.should.be.ok;
      done();
    });
  });

});


})(); // Wrapper
