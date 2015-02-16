/**
* Tests against our "hidden" utilities
*
* The MIT License (MIT)
* Copyright (c) 2015 Forfuture LLC <we@forfuture.co.ke>
*/


// Silence jshint about mocha's global vars
/* global describe, it */


// npm-installed modules
var lodash = require("lodash");
var should = require("should");


// own modules
var utils = require("../lib/utils");


describe("Utilities module", function() {
  "use strict";

  it("should export the builtin `util` module, AS IS", function() {
    var util = require("util");
    for (var key in util) {
      should(util[key]).eql(utils[key]);
    }
  });

  it.skip("has .isObject for checking for objects", function() {
    var object = {};
    utils.isObject(object).should.be.true();
    var types = [[], "string", 0, true, false, null, undefined];
    types.forEach(function(type) {
      utils.isObject(type).should.be.false();
    });
  });

});


describe("utils.fillObject", function() {
  "use strict";

  it("fills in left-out options with defaults", function() {
    var defaults = {
      name: "voldemort",
      role: "magician",
      talents: {
        magician: true,
        awesome: "abit"
      }
    };
    var options = {
      name: "harry porter",
      talents: { awesome: "alot" }
    };
    var loadedOptions = utils.fillObject(options, defaults);
    loadedOptions.should.eql({
      name: options.name,
      role: defaults.role,
      talents: {
        magician: defaults.talents.magician,
        awesome: options.talents.awesome
      }
    });
  });

  it("returns the defaults exactly if object is undefined", function() {
    var object = { name: "harry", talents: { magician: true } };
    utils.fillObject(undefined, object).should.eql(object);
  });

  it("returns the defaults as is if the object is not really a plain object", function() {
    var object = { name: "tester-riffic" };
    utils.fillObject("", object).should.eql(object);
    utils.fillObject(-1, object).should.eql(object);
    utils.fillObject(0, object).should.eql(object);
    utils.fillObject(1, object).should.eql(object);
    utils.fillObject(true, object).should.eql(object);
    utils.fillObject(false, object).should.eql(object);
    utils.fillObject([], object).should.eql(object);
    utils.fillObject([1], object).should.eql(object);
  });

});


describe("utils.getOptions", function() {
  var options = require("../lib/config.json");

  it("should return options in lib/config.json if called without arg", function() {
    utils.getOptions().should.eql(options);
    utils.getOptions(null).should.eql(options);
    utils.getOptions("").should.eql(options);
  });

  it("should return options in an object from lib/config.json if called\
  with an object offset arg", function() {
    utils.getOptions("server").should.eql(options.server);
    utils.getOptions("server.port").should.eql(options.server.port);
    should(utils.getOptions("nonExistingObject")).eql(undefined);
  });

  it("should return a filled object with passed options and missing defaults\
  from lib/config.json", function() {
    var userOptions = { server: { port: 101010110101 } };
    var expectedObject = lodash.cloneDeep(options);
    expectedObject.server.port = userOptions.server.port;
    utils.getOptions(null, userOptions).should.eql(expectedObject);
    utils.getOptions("server", userOptions.server).should.eql(expectedObject.server);
    utils.getOptions("server.port", userOptions.server.port).should.eql(expectedObject.server.port);
  });

});
