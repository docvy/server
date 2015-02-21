/**
* Tests against our utilities
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


// Silence jshint about mocha's global vars
/* global describe, it */

(function() {
"use strict";


// npm-installed modules
var lodash = require("lodash");
var should = require("should");


// own modules
var utils = require("../lib/utils");


describe("Utilities module", function() {

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
    var _types = [[], [1], "", "string", -1, 0, 1, true, false, function() {}];
    _types.forEach(function(_type) {
      utils.fillObject(_type, object).should.eql(object);
    });
  });

});


describe("utils.getOptions", function() {

  var options = require("../lib/config.json");

  it("should return options in lib/config.json if called without arg", function() {
    utils.getOptions().should.eql(options);
    utils.getOptions(null).should.eql(options);
    utils.getOptions("").should.eql(options);
  });

  it("should return options in an object from lib/config.json if called " +
  "with an object offset arg", function() {
    utils.getOptions("server").should.eql(options.server);
    utils.getOptions("server.port").should.eql(options.server.port);
    should(utils.getOptions("nonExistingObject")).eql(undefined);
  });

  it("should return a filled object with passed options and missing defaults " +
  "from lib/config.json", function() {
    var userOptions = { server: { port: 101010110101 } };
    var expectedObject = lodash.cloneDeep(options);
    expectedObject.server.port = userOptions.server.port;
    utils.getOptions(null, userOptions).should.eql(expectedObject);
    utils.getOptions("server", userOptions.server).should.eql(expectedObject.server);
    utils.getOptions("server.port", userOptions.server.port).should.eql(expectedObject.server.port);
  });

  it.skip("should return defaults if type of defaults & options don't' match", function() {
    var options = require("../lib/config.json").server;
    var _types = [[], "", 0, true, function() {}];
    _types.forEach(function(_type) {
      utils.getOptions("server", _type).should.eql(options);
    });
  });

  it("should return defaults if only one arg is passed and it is not a string", function() {
    var options = require("../lib/config.json");
    var _types = [[], 0, true, function() {}, {}];
    _types.forEach(function(_type) {
      utils.getOptions(_type).should.eql(options);
    });
  });

});


describe("utils.defineCallback", function() {

  it("returns a function if no callback is passed", function() {
    utils.defineCallback().should.be.a.Function;
  });

  it("callback passed must be a function", function() {
    var _types = [[], [1], "", "string", -1, 0, 1, {}, { name: "mocha" }, true, false];
    _types.forEach(function(_type) {
      utils.defineCallback(_type).should.not.eql(_type).and.be.a.Function;
    });
  });

});


describe("utils.getAccepts", function() {

  it("returns an array of accepted types", function() {
    var accepts = utils.getAccepts("text/html,application/json");
    accepts.should.be.an.Array;
  });

  it("uses the comma as the delimiter", function() {
    var acceptString = "text/html,application/json,application/xml";
    var accepts = utils.getAccepts(acceptString);
    accepts.should.have.a.lengthOf(3);
  });

  it("removes all slashes in the accept types", function() {
    var acceptString = "text/html, application/json";
    var accepts = utils.getAccepts(acceptString);
    accepts.forEach(function(accept) {
      accept.should.not.containEql("/");
    });
  });

  it("ignores whitespace between types", function() {
    var acceptString = "text/html,\napplication/json,  application/xml";
    var accepts = utils.getAccepts(acceptString);
    accepts.should.have.a.lengthOf(3);
    var whitespaces = ["\n", "\t", " "];
    accepts.forEach(function(accept) {
      whitespaces.forEach(function(whitespace) {
        accept.should.not.containEql(whitespace);
      }); // whitespaces.forEach
    }); // accepts.forEach
  });

});


})(); // Wrapper