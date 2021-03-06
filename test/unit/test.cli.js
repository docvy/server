/**
* Tests against The Docvy Command-line runner
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


"use strict";


// npm-installed modules
var request = require("request").defaults({ json: true });
var rooted = require("rooted");
var shell = require("shelljs");
var should = require("should");


// own modules
var config = rooted("lib/config.json");
var server = rooted("lib/server");


// module variables
var rootDir = process.cwd();
var docvyCmd = rootDir + "/bin/docvy-server";


function cmd(args) {
  return docvyCmd + " " + args;
}


describe("CLI", function() {
  var url = "http://localhost:" + config.server.port;

  afterEach(function(done) {
    setTimeout(done, 1000);
  });

  it("`start` starts server in daemon mode", function(done) {
    shell.exec(cmd("start"), function(code) {
      code.should.eql(0);
      setTimeout(function() {
        request.get(url, function(err) {
          should(err).not.be.ok();
          request.del(url + "/stop", function() { done(); });
        });
      }, 1000);
    });
  });

  it("`stop` stops server", function(done) {
    server.start(function() {
      shell.exec(cmd("stop"), function(code) {
        code.should.eql(0);
        request.get(url, function(err) {
          err.should.be.ok();
          err.code.should.eql("ECONNREFUSED");
          done();
        }); // request
      }); // shell.exec
    }); // server.start
  }); // it

  it.skip("-p allows passing port number", function(done) {
    var _port = 9821;
    shell.exec(cmd("-s -p " + _port), function(code) {
      code.should.eql(0);
      request.get("http://localhost:" + _port, function(err) {
        should(err).not.be.ok();
        request.del(url + "/stop", function() { done(); });
      }); // request.get
    }); // shell.exec
  });

  it.skip("-a attaches server to stdio", function(done) {
    var child = shell.exec(cmd("-s -a"), { async: true });
    child.stdout.on("data", function() {
      request.get(url, function(err) {
        should(err).not.be.ok();
        request.del(url + "/stop", function() { done(); });
      }); // request
    });
  });

});
