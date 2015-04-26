/**
* Tests against The Docvy Server
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


"use strict";


// npm-installed modules
var request = require('request').defaults({ json: true });
var should = require("should");


// own modules
var config = require("../../lib/config.json");
var server = require("../../lib/server");


describe("Server module", function() {

  it.skip("should have a .start function for starting server",
  function() {
    should(server.start).be.a.Function;
  });

});


describe("Server.start", function() {

  function testIfStarted(_port, done) {
    request('http://localhost:' + _port + '/', function (error) {
      should(error).not.be.ok;
      error = error || {};
      should(error.code).not.eql("ECONNREFUSED");
      done();
    }); // request
  }

  afterEach(function(done) {
    server.stop(done);
  });

  it("should start server at default port", function(done) {
    server.start(function() {
      testIfStarted(config.server.port, done);
    }); // server.start
  });

  it("should start server at defined port",  function(done) {
    var _port = 9876;
    server.start({ port: _port }, function() {
      testIfStarted(_port, done);
    }); // server.start
  });

});


describe("Server.stop", function() {

  function testIfStopped(_port, done) {
    request('http://localhost:' + _port + '/', function (error) {
      should(error).be.ok;
      should(error.code).eql("ECONNREFUSED");
      done();
    }); // request
  }

  it("should stop server", function(done) {
    var _port = 9532;
    server.start({ port: _port }, function() {
      server.stop(function() {
        testIfStopped(_port, done);
      }); // server.stop
    }); // server.start
  });

});

