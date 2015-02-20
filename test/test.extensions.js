/**
* Tests aganst The Docvy Extensions loader
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/

// built-in modules
var fs = require("fs");
var path = require("path");


// npm-installed modules
var should = require("should");


// own modules
var dextensions = require("../lib/extensions");


describe("dextensions.load()", function() {

  it("loads an extension given a file extensions");

  it("passes an error if extension is not registered");

});


describe("dextensions.lookup()", function() {

  it("loads all available extensions");

  it("checks if extensions for a filetype is available");

});


describe("dextensions.lookupPath()", function() {

  it("returns the directory where extensions are looked for");

});


describe("each extension", function() {

  it("should have an .extnames property");

  it("should have .load() for loading compatible files");

});
