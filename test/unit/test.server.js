/**
 * Tests against The Docvy Server
 *
 * The MIT License (MIT)
 * Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
 */


"use strict";


// npm-installed modules
var request = require("request").defaults({ json: true });
var rooted = require("rooted");
var should = require("should");


// own modules
var config = rooted("lib/config.json");
var server = rooted("lib/server");


describe("Server module", function() {
  it("should have a .start function for starting server", function() {
    should(server.start).be.a.Function();
  });

  it("should have a .stop function for stopping server", function() {
    should(server.stop).be.a.Function();
  });
});


describe("Server.start", function() {
  function testIfStarted(port, done) {
    request("http://localhost:" + port + "/", function (error) {
      should(error).not.be.ok();
      error = error || {};
      should(error.code).not.eql("ECONNREFUSED");
      done();
    });
  }

  afterEach(function(done) {
    server.stop(done);
  });

  it("should start server at default port", function(done) {
    server.start(function() {
      testIfStarted(config.server.port, done);
    });
  });

  it("should start server at defined port", function(done) {
    var port = 9876;
    server.start({ port: port }, function() {
      testIfStarted(port, done);
    }); // server.start
  });
});


describe("Server.stop", function() {
  function testIfStopped(port, done) {
    request("http://localhost:" + port + "/", function (error) {
      should(error).be.ok();
      should(error.code).eql("ECONNREFUSED");
      done();
    }); // request
  }

  it("should stop server", function(done) {
    var port = 9532;
    server.start({ port: port }, function() {
      server.stop(function() {
        testIfStopped(port, done);
      }); // server.stop
    }); // server.start
  });
});
