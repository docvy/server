/**
* Tests against The Docvy Server
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


// Silence jshint about mocha's global vars
/* global describe, it */


// built-in modules
var fs = require("fs");
var path = require("path");


// npm-installed modules
var request = require('request').defaults({json: true});
var should = require("should");


// own modules
var server = require("../lib/server");


describe("Server module", function() {
  "use strict";

  it.skip("should have a .start function for starting server", function() {
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
    var _port = require("../lib/config.json").server.port;
    server.start(function() {
      testIfStarted(_port, done);
    }); // server.start
  });

  it("should start server at defined port",  function(done) {
    var _port = 9876;
    server.start({port: _port}, function() {
      testIfStarted(_port, done);
    }); // server.start
  });

});


describe("Server.stop", function() {

  it("reference server.close", function() {
    server.stop.should.eql(server.close);
  });

  it("should stop server", function(done) {
    var _port = 9532;
    server.start({port: _port}, function() {
      server.stop(function() {
        request('http://localhost:' + _port + '/', function (error) {
          error.should.be.ok;
          error.code.should.eql("ECONNREFUSED");
          done();
        }); // request
      }); // server.stop
    }); // server.start
  });

});


describe("Server endpoint /stop", function() {

  it("should stop server", function(done) {
    this.timeout(6000);
    var _port = 9945;
    var _url = "http://localhost:" + _port + "/stop"; 
    server.start({port: _port}, function() {
      request.del(_url, function(err, res, body) {
        should(err).not.be.ok;
        res.statusCode.should.eql(200);
        body.message.should.eql("acknowledged");
        request.del(_url, function(err, res, body) {
          err.should.be.ok;
          err.code.should.eql("ECONNREFUSED");
          done();
        });
      });
    });
  });

});


describe("Server endpoint /files/", function() {
  "use strict";
  var _port = require("../lib/config.json").server.port; 
  var _url =  "http://localhost:" + _port + "/files/";
  var _cwd = path.resolve(".");

  function testRes(req_options, done) {
    request.get(req_options, function(error, res, body) {
      should(error).not.be.ok;
      res.statusCode.should.eql(200);
      var num_files = body.directories.length + body.files.length;
      var real_num = fs.readdirSync(_cwd).length;
      num_files.should.eql(real_num);
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
  "use strict";

  it("gets file data handled by an extension");

});
