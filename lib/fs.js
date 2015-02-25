/**
* The Docvy File System Handler
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


(function() {
"use strict";


// built-in modules
var fs = require("fs");
var path = require("path");


// npm-installed modules
var lodash = require("lodash");


// own modules
var utils = require("./utils");


/**
* Stat files in array <files> at the <dirpath>
*
* Synchronous internally due to error occurring statting files quickly
* one after the other.
* See implementation at commit
* <faaf2b871f424abc79954a688d2588ee5de6835d>
*
* @param <dirpath> -- {String} path to the directory holding the files
* @param <files> -- {Array} array of filenames
* @param <callback> -- {Function} callback(err, files)
* @callbackparam <files> {Array} an array of files with stats
*/
exports.stat = stat;
function stat(dirpath, files, callback) {
  var stattedFiles = { directories: [], files: [] };
  var error = null;
  stattedFiles.currentDir = dirpath;
  files.forEach(function(file) {
    var filepath, stats;
    try {
      filepath = path.resolve(dirpath, file);
      stats = fs.statSync(filepath);
      stats.filename = file;
      stats.path = filepath;
      if (stats.isFile()) { stattedFiles.files.push(stats); }
      if (stats.isDirectory()) { stattedFiles.directories.push(stats); }
    } catch (err) {
      error = err;
    }
  });
  return callback(error, stattedFiles);
}


/**
* Read directory
*
* @param dirpath -- {String} path to directory to read, preferably
* absolute
* @param callback -- {Function} callback(err, files)
*/
exports.readdir = readdir;
function readdir(dirpath, options, callback) {
  if ((! callback) && utils.isFunction(options)) {
    callback = options;
    options = { };
  }
  fs.readdir(dirpath, function(err, files) {
    if (err) { return callback(err); }
    // ignoring dot files
    if (options.ignoreDotFiles) {
      files = lodash.filter(files, function(file) {
        return file[0] !== ".";
      });
    }
    stat(dirpath, files, function(err, files) {
      return callback(err, files);
    });
  });
}


/**
* Reads a file
*
* @param <filepath> -- {String} path to the file
* @param <callback> -- {Function} callback(err, data)
* @callbackparam <data> -- {String} data as string
*/
exports.readFile = readFile;
function readFile(filepath, callback) {
  fs.readFile(filepath, { encoding: "utf8" }, function(err, data) {
    if (err) { return callback(err); }
    return callback(null, data);
  });
}


})();
