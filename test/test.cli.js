/**
* Tests against The Docvy Command-line runner
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


// Silence jshint about mocha's global vars
/* global describe, it, afterEach */


(function() {
"use strict";


// npm-installed modules
var request = require("request").defaults({json: true});
var shell = require('shelljs');
var should = require("should");


// own modules
var server = require("../lib/server");


// module variables
var config = require("../lib/config.json");
var rootDir = process.cwd();
var docvyCmd = rootDir + "/bin/docvy";


function cmd(args) {
  return docvyCmd + " " + args;
}


describe("CLI", function() {
  var url = "http://localhost:" + config.server.port;

  afterEach(function(done) {
    setTimeout(done, 1000);
  });

  it("-s starts server in daemon mode", function(done) {
    shell.exec(cmd("-s"), function(code) {
      code.should.eql(0);
      setTimeout(function() {
        request.get(url, function(err) {
          should(err).not.be.ok;
          request.del(url + "/stop", function() { done(); });
        });
      }, 1000);
    });
  });

  it("-x stops server", function(done) {
    server.start(function() {
      shell.exec(cmd("-x"), function(code) {
        code.should.eql(0);
        request.get(url, function(err) {
          err.should.be.ok;
          err.code.should.eql("ECONNREFUSED");
          done();
        }); // request
      }); // shell.exec
    }); // server.start
  }); // it

  it("-p allows passing port number", function(done) {
    var _port = 9821;
    shell.exec(cmd("-s -p " + _port), function(code) {
      code.should.eql(0);
      request.get("http://localhost:" + _port, function(err) {
        should(err).not.be.ok;
        request.del(url + "/stop", function() { done(); });
      }); // request.get
    }); // shell.exec
  });

  it.skip("-a attaches server to stdio", function(done) {
    var child = shell.exec(cmd("-s -a"), { async: true });
    child.stdout.on('data', function() {
      request.get(url, function(err) {
        should(err).not.be.ok;
        request.del(url + "/stop", function() { done(); });
      }); // request
    });
  });

});


})(); // Wrapper
