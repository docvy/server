/**
* Tests against our utilities
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


"use strict";


// npm-installed modules
var should = require("should");


// own modules
var utils = require("../../lib/utils");


describe("Utilities module", function() {

  it("should export the inbuilt configuration values", function() {
    utils.config.should.eql(require("../../lib/config.json"));
  });

});


describe("utils.getAccepts", function() {

  it("returns an array of accepted types", function() {
    var accepts = utils.getAccepts("text/html,application/json");
    should(accepts).be.an.Array;
  });

  it("uses the comma as the delimiter", function() {
    var acceptString = "text/html,application/json,application/xml";
    var accepts = utils.getAccepts(acceptString);
    should(accepts).have.a.lengthOf(3);
  });

  it("removes all slashes in the accept types", function() {
    var acceptString = "text/html, application/json";
    var accepts = utils.getAccepts(acceptString);
    accepts.forEach(function(accept) {
      should(accept).not.containEql("/");
    });
  });

  it("ignores whitespace between types", function() {
    var acceptString = "text/html,\napplication/json,  application/xml";
    var accepts = utils.getAccepts(acceptString);
    should(accepts).have.a.lengthOf(3);
    var whitespaces = ["\n", "\t", " "];
    accepts.forEach(function(accept) {
      whitespaces.forEach(function(whitespace) {
        should(accept).not.containEql(whitespace);
      }); // whitespaces.forEach
    }); // accepts.forEach
  });

});


describe("utils.getDatatype", function() {

  it("returns extname without the . (dot)", function() {
    should(utils.getDatatype(".html")).eql("html");
  });

  it("return * (asterisk) if its an empty extname", function() {
    should(utils.getDatatype("")).eql("*");
  });

});
