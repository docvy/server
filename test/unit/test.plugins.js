/**
 * Tests aganst The Docvy Plugins loader
 *
 * The MIT License (MIT)
 * Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
 */


"use strict";


// npm-installed modules
var rooted = require("rooted");
var should = require("should");


// own modules
var dplugins = rooted("lib/plugins");
var errors = rooted("lib/errors");
var testUtils = rooted("test/utils");


// copying over all test plugins
before(function(done) {
  testUtils.copyPlugins(done);
});


describe("dplugins.handle", function() {
  var testDatatype = "DocvyTestTypeRaw";
  var testExpects = ["DocvyTestTypeProcessed"];

  it("runs a plugin", function(done) {
    process.env.DOCVY_TEST_PLUGIN_MODE = "success";
    var data = "some data for me";
    dplugins.handle(testDatatype, data, testExpects, function(err, type, pData) {
      should(err).not.be.ok();
      should(type).eql("DocvyTestTypeProcessed");
      should(pData).eql(data);
      done();
    });
  });

  it("passes an error if no plugin can process type", function(done) {
    dplugins.handle("NonExistingType", "data", testExpects, function(err) {
      should(err).be.an.instanceOf(errors.plugins.MissingError);
      done();
    });
  });

  it("passes an error if no extension can produce type", function(done) {
    dplugins.handle(testDatatype, "data", ["NonExistingType"], function(err) {
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
