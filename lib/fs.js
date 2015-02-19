/**
* The Docvy File System Handler
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


// built-in modules
var fs = require("fs");
var path = require("path");


/**
* Stat files in array <files> at the <dirpath>
*
* Synchronous internally due to error occurring statting files quickly one after
* the other.
* Implementation at commit <faaf2b871f424abc79954a688d2588ee5de6835d>
*
* @param <dirpath> -- {String} path to the directory holding the files
* @param <files> -- {Array} array of filenames
* @param <callback> -- {Function} callback(err, files)
* @passToCallback files {Array} an array of files with stats
*/
exports.stat = stat;
function stat(dirpath, files, callback) {
  var statted_file_num = 0;
  var statted_files = { directories: [], files: [] };
  var error = null;
  files.forEach(function(file) {
    var filepath;
    try {
      filepath = path.resolve(dirpath, file);
      stats = fs.statSync(filepath);
      stats.filename = file;
      stats.path = filepath;
      if (stats.isFile()) { statted_files.files.push(stats); }
      if (stats.isDirectory()) { statted_files.directories.push(stats); }
      if (files.length === ++statted_file_num) { return callback(error, statted_files); }
    } catch (err) {
      error = err;
    }
  });
}


/**
* Read directory
*
* @param dirpath -- {String} path to directory to read, preferably absolute
* @param callback -- {Function} callback(err, files)
*/
exports.readdir = readdir;
function readdir(dirpath, callback) {
  fs.readdir(dirpath, function(err, files) {
    if (err) { return callback(err); }
    stat(dirpath, files, function(err, files) {
      return callback(err, files);
    });
  });
}
