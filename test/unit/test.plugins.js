/**
* Tests aganst The Docvy Plugins loader
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


"use strict";


// npm-installed modules
var should = require("should");


// own modules
var dplugins = require("../../lib/plugins");
var errors = require("../../lib/errors");
var testUtils = require("../utils");


// copying over all test plugins
before(function(done) {
  testUtils.copyPlugins(done);
});


describe.skip("dplugins.handle()", function() {
  var testDatatype = "DocvyTestTypeRaw";
  var testExpects = ["DocvyTestTypeProcessed"];

  it("runs a plugin", function(done) {
    process.env.DOCVY_TEST_PLUGIN_MODE = "success";
    var data = "some data for me";
    dplugins.handle(testDatatype, data, testExpects, function(err,
    _type, pData) {
      should(err).not.be.ok;
      _type.should.be.ok;
      pData.should.be.ok;
      done();
    });
  });

  it("passes an error if no extension can process type",
  function(done) {
    var testDatatype = ["NonExistingType"];
    dplugins.handle(testDatatype, "data", testExpects, function(err) {
      should(err).be.an.instanceOf(errors.plugins.MissingError);
      done();
    });
  });

  it("passes an error if no extension can handle type",
  function(done) {
    var testExpects = ["NonExistingType"];
    dplugins.handle(testDatatype, "data", testExpects, function(err) {
      should(err).be.an.instanceOf(errors.plugins.MissingError);
      done();
    });
  });

  it("passes an eror if extension crashes", function(done) {
    process.env.DOCVY_TEST_PLUGIN_MODE = "crash";
    dplugins.handle(testDatatype, "data", testExpects, function(err) {
      should(err).be.an.instanceOf(errors.plugins.CrashError);
      done();
    });
  });

  it.skip("passes an error if plugin hangs", function(done) {
    process.env.DOCVY_TEST_PLUGIN_MODE = "hung";
    dplugins.handle(testDatatype, "data", testExpects, function(err) {
      should(err).not.be.an.instanceOf(errors.plugins.HungError);
      done();
    });
  });

});


describe("dplugins.getPluginsInformation()", function() {

  it("passes an array of information", function(done) {
    dplugins.getPluginsInformation(function(err, pluginsInfo) {
      pluginsInfo.should.be.an.Array;
      done();
    });
  });

});
