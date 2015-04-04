/**
* Tests against The Docvy File System Handler
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


"use strict";


// built-in modules
var fs = require("fs");
var path = require("path");


// npm-installed modules
var lodash = require("lodash");
var should = require("should");


// own modules
var dfs = require("../lib/fs");


describe("dfs.stat callback of files", function() {
  var cwd = path.resolve(".");
  var cwdFiles = fs.readdirSync(cwd);
  var statFiles, allFiles, filenames = [];

  before(function(done) {
    cwdFiles.push("..");
    dfs.stat(cwd, cwdFiles, function(err, files) {
      should(err).not.be.ok;
      statFiles = files;
      allFiles = lodash.flatten([files.directories, files.files]);
      for (var index = 0, length = allFiles; index < length; index++) {
        filenames.push(allFiles[index].filename);
      }
      done();
    });
  });

  it("holds array of files", function() {
    statFiles.directories.should.be.an.Array;
    statFiles.files.should.be.an.Array;
  });

  it("contains files in the directory", function() {
    for (var index = 0, length = cwdFiles; index < length; index++) {
      allFiles.should.containEql(cwdFiles[index]);
    }
  });

  it("has impoved fs.stats", function() {
    var file;
    for (var index = 0; index < allFiles.length; index++) {
      file = allFiles[index];
      should(file.filename).be.a.String;
      should(file.path).be.a.String;
    }
  });

  it("is passed along by dfs.readdir", function(done) {
    dfs.readdir(cwd, function(err, files) {
      should(err).not.be.ok;
      files.should.eql(statFiles);
      done();
    });
  });

});


describe("dfs.readFile", function() {

  it("reads file data as string", function(done) {
    dfs.readFile(__dirname + "/mock/data.txt", function(err, data) {
      should(err).not.be.ok;
      data.should.be.a.String;
      done();
    });
  });

  it("passes error if file is not found", function(done) {
    dfs.readFile(__dirname +"/mock/nonExistant", function(err, data) {
      err.should.be.ok;
      should(data).not.be.ok;
      done();
    });
  });

});
