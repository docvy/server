/**
* Tests against The Docvy File System Handler
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


// Silence jshint about mocha's global vars
/* global describe, it */


(function() {
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
  var cwd_files = fs.readdirSync(cwd);
  var stat_files, all_files, filenames = [];

  before(function(done) {
    dfs.stat(cwd, cwd_files, function(err, files) {
      should(err).not.be.ok;
      stat_files = files;
      all_files = lodash.flatten([files.directories, files.files]);
      for (var index = 0, length = all_files; index < length; index++) {
        filenames.push(all_files[index].filename);
      }
      done();
    });
  });

  it("holds array of files", function() {
    stat_files.directories.should.be.an.Array;
    stat_files.files.should.be.an.Array;
  });

  it("contains files in the directory", function() {
    for (var index = 0, length = cwd_files; index < length; index++) {
      all_files.should.containEql(cwd_files[index]);
    }
  });

  it("has impoved fs.stats", function() {
    var file;
    for (var index = 0, length = all_files.length; index < length; index++) {
      file = all_files[index];
      should(file.filename).be.a.String;
      should(file.path).be.a.String;
    }
  });

  it("is passed along by dfs.readdir", function(done) {
    dfs.readdir(cwd, function(err, files) {
      should(err).not.be.ok;
      files.should.eql(stat_files);
      done();
    });
  });

});

})(); // Wrapper
