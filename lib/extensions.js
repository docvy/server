/**
* The Docvy Extensions Handler
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


(function() {
"use strict";


// built-in modules
var domain = require("domain");
var fs = require("fs");
var path = require("path");


// npm-installed modules
var debug = require("debug")("docvy:extensions");


// module variables
var extensionsDirectory = path.join(process.env.HOME, ".docvy", "extensions");
var registry = { };


/**
* Returns path to the extension directory
*
* @return {String} path to the extension directory
*/
exports.extDir = extDir;
function extDir() {
  return extensionsDirectory;
}


/**
* Handles different content types using extensions
*
* @param <accepts> -- {Array} accepted types
* @param <rawData> -- {String} file data
* @param <callback> -- {Function} callback(err, _type, pData)
* @callbackparam <_type> -- {String} data type of the returned data
* @callbackparam <pData> -- {String} processed data
*/
exports.handle = handle;
function handle(accepts, rawData, callback) {
  debug("handling content");
  registryLookup(accepts, function(err, extension) {
    if (err) { return callback(err); }
    var extensionDomain = domain.create();
    extensionDomain.add(accepts);
    extensionDomain.add(rawData);
    extensionDomain.add(callback);
    extensionDomain.add(extension);
    extensionDomain.on("error", function(domainError) {
      debug("extension crashed: %s", extension._name);
      return callback(domainError);
    });
    extensionDomain.run(function() {
      debug("running extension: %s", extension._name);
      extension.run(accepts, rawData, function(err, _type, pData) {
        return callback(err, _type, pData);
      });
    });
  });
}


/**
* Looks for extension from Registry
*
* @param <accepts> -- {Array} array of accepted types
* @param <callback> -- {Function} callback(err, extension)
*/
function registryLookup(accepts, callback) {
  debug("looking for extension in registry");
  function lookup() {
    for (var extensionName in registry) {
      var extension = registry[extensionName];
      if (extension.accepts(accepts)) {
        callback(null, extension._module);
        return true;
      }
    }
    return false;
  }

  if (! lookup()) {
    // next option: look for extension and load it
    registryRefresh(function(err) {
      if (err) {
        // could not refresh registry
        debug("error refreshing registry");
        return callback(new Error());
      }
      if (! lookup()) {
        // only option: pass an error
        debug("no extension found");
        return callback(new Error());
      }
    });
  }
}


/**
* Refresh the registry
*
* @param <callback> -- {Function} callback(err)
*/
function registryRefresh(callback) {
  debug("refreshing registry");
  fs.readdir(extensionsDirectory, function(err, files) {
    if (err) { return callback(err); }
    files.forEach(function(file) {
      var extensionPath = path.join(extensionsDirectory, file);
      var extensionModule;
      try {
        extensionModule = require(extensionPath);
        registry[file] = new Extension(file, extensionModule);
      } catch(err) {
        debug("loading extension failed");
      }
    });
    return callback(null);
  });
}


/**
* Class for Extension
*
* @param <name> -- {String} name of extension
* @param <module> -- {Module} module of extension
* @return {Extension}
*/
function Extension(name, module) {
  this._name = name;
  this._module = module;
  return this;
}


/**
* Returns True/False if extension handles accepted type
*
* @param <accepts> -- {Array} accepted types
* @return {Boolean}
*/
Extension.prototype.accepts = function(accepts) {
  for (var idx = 0, le = accepts.length; idx < le; idx++) {
    for (var i = 0, l = this._module.accepts; i < l; i++) {
      if (this._module.accepts[i] === accepts[idx]) {
        return true;
      }
    }
  }
  return false;
};


})();
