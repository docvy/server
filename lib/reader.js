/**
* The Docvy Reading Handler
*
* This module handles reading files and directories. This allows us
* to place all this "reading" logic from the server module. (Separation
* of Concerns)
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


"use strict";


// built-in modules
var path = require("path");


// npm-installed modules
var CapQ = require("capq");
var debug = require("debug")("docvy:server:reader");


// own modules
var dcache = require("./cache");
var dfs = require("./fs");
var dplugins = require("./plugins");
var dutils = require("./utils");


// module variables
var recentfilesQueue = new CapQ({
  capacity: dutils.config("recentfiles.number"),
  autopop: true
});


/**
* Reading directories
*/
exports.readdir = dfs.readdir;


/**
* Reading files
*
* @param <filepath> -- {String} path to file
* @param <expects> -- {Array} array of the expected content types
* @param <callback> -- {Function} callback(err, type, processedData)
*/
exports.readfile = readfile;
function readfile(filepath, expects, callback) {
  var datatype = dutils.getDatatype(path.extname(filepath));
  // we look for its converted data from cache
  dcache.plugins.getData(filepath, expects, function(err, _type,
  pData) {
    if (err) { /* ignore this error for now */ }
    if (pData) {
      return callback(null, _type, pData);
    }

    // we read the file content
    dfs.readFile(filepath, function(err, data) {
      if (err) {
        return callback(err);
      }

      // run plugin with file content
      dplugins.handle(datatype, data, expects, function(err, _type,
      processedData) {
        if (err) {
          return callback(err);
        }

        // setting into cache
        dcache.plugins.setData(filepath, _type, processedData,
        function(err) {
          if (err) { /* we ignore this error for now */  }
          dcache.plugins.proxy.save(function(err) {
            debug("saved: %j", err);
          });
          recentfilesQueue.rpush(filepath);
          return callback(null, _type, processedData);
        }); // dcache.plugins.setData
      }); // dplugins.handle
    }); // dfs.readFile
  }); // dcache.plugins.getData
}

