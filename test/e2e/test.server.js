/**
* Tests against The Docvy Server
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


"use strict";


// built-in modules
var fs = require("fs");
var path = require("path");


// npm-installed modules
var request = require('request').defaults({json: true});
var should = require("should");


// own modules
var config = require("../../lib/config.json");
var server = require("../../lib/server");


describe("Server endpoint /files/", function() {

  var _port = config.server.port; 
  var _url =  "http://localhost:" + _port + "/files/";
  var _cwd = path.resolve(".");

  function testRes(reqOptions, done) {
    request.get(reqOptions, function(error, res, body) {
      should(error).not.be.ok;
      res.statusCode.should.eql(200);
      var numFiles = body.directories.length + body.files.length;
      var realNum = fs.readdirSync(_cwd).length + 1;
      numFiles.should.eql(realNum);
      done();
    });
  }

  before(function(done) {
    server.start(done);
  });

  after(function(done) {
    server.stop(done);
  });

  it("reads directory from param <dirpath>", function(done) {
    testRes({uri: _url, qs: {dirpath: _cwd}}, done);
  });

  it("reads from cwd if param <dirpath> is missing", function(done) {
    testRes({uri: _url}, done);
  });

});


describe.skip("Server endpoint /file/", function() {

  it("gets file data handled by an extension");

});
