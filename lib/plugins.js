/**
* The Docvy Plugins Handler
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


/**
* Displaying files of different content types using Plugins
* --------------------------------------------------------------
* All plugins must declare the content types they are capable of
* handling and the content types of their output. When a client
* app requests to read a file, its file type and the content type 
* the app expects to receive are obtained. They are both used to
* search for a suitable plugin.
*
* The plugin's `.handle()` method is called with the expected file
* type and the file data passed. A callback is also passed. Data
* processed by the plugin is then passed by the plugin to the
* callback. Any error encountered by a plugin may be passed to
* the callback.
*
* Plugin hang detection works by setting a timeout of
* approximately 45 secs, after which, if the plugin has not called
* the callback, its execution is cancelled.
*
* Plugins are run entirely in domains to avoid crashes by the
* plugins affecting the server process.
*/


(function() {
"use strict";


// built-in modules
var domain = require("domain");
var fs = require("fs");
var path = require("path");


// npm-installed modules
var debug = require("debug")("docvy:plugins");
var lodash = require("lodash");


// own modules
var errors = require("./errors");
var utils = require("./utils");


// module variables
var pluginsDirectory = utils.getPath("app.plugins");
var registry = { };


/**
* Handles different content types using plugins
*
* @param <datatype> -- {String} type of data
* @param <rawData> -- {String} file data
* @param <expepts> -- {Array} expected types
* @param <callback> -- {Function} callback(err, _type, pData)
* @callbackparam <_type> -- {String} data type of the returned
*   data
* @callbackparam <pData> -- {String} processed data
*/
exports.handle = handle;
function handle(datatype, rawdata, expects, callback) {
  debug("attempting to handle data of type: %s", datatype);
  registryLookup(datatype, expects, function(err, plugin) {
    if (err) { return callback(err); }
    var pluginDomain = domain.create();
    var pluginHangTimeout;
    // plugin hang detection
    pluginHangTimeout = setTimeout(function() {
      debug("plugin hung detected, disposing plugin's domain");
      pluginDomain.dispose();
      return callback(new errors.plugins.HungError());
    }, utils.config.plugins.timeout_ms); // jshint ignore: line
    // plugin error
    pluginDomain.on("error", function(domainError) {
      debug("plugin crashed: %s", plugin._name);
      pluginHangTimeout.close();
      return callback(new errors.plugins.CrashError(domainError));
    });
    // plugin execution
    pluginDomain.run(function() {
      debug("running plugin: %s", plugin._name);
      plugin._module.run(rawdata, expects, function(err, _type,
      pData) {
        pluginHangTimeout.close();
        return callback(err, _type, pData);
      }); // plugin._module.run
    }); // pluginDomain.run

  }); // registryLookup
}


/**
* Looks for plugin from Registry
*
* @param <datatype> -- {String} type of data in file
* @param <expects> -- {Array} array of expected types
* @param <callback> -- {Function} callback(err, plugin)
*/
function registryLookup(datatype, expects, callback) {
  debug("looking for plugin in registry");
  function lookup() {
    for (var pluginName in registry) {
      var plugin = registry[pluginName];
      if (plugin.accepts(datatype) && plugin.produces(expects)) {
        callback(null, plugin);
        return true;
      }
    }
    return false;
  }

  // immediately lookup in registry
  if (! lookup()) {
    // refresh registry
    registryRefresh(function(err) {
      if (err) {
        // could not refresh registry
        debug("error refreshing registry");
        return callback(new Error());
      }
      // lookup in registry again for plugin
      if (! lookup()) {
        // only option: pass an error
        debug("no plugin found");
        debug("registry state: %j", registry);
        return callback(new errors.plugins.MissingError());
      }
    }); // registryRefresh
  }
}


/**
* Refresh the registry
*
* @param <callback> -- {Function} callback(err)
*
* Notes:
* We shall treat a registry refresh as a failure just because one or
* more plugins could not be loaded.
*/
function registryRefresh(callback) {
  debug("refreshing registry");
  fs.readdir(pluginsDirectory, function(err, files) {
    if (err) { return callback(err); }
    files.forEach(function(file) {
      var pluginPath = path.join(pluginsDirectory, file);
      var pluginModule;
      try {
        pluginModule = require(pluginPath);
        if (hasInterface(pluginModule)) {
          registry[file] = new Plugin(file, pluginModule);
        }
      } catch(err) {
        debug("loading plugin failed");
      }
    });
    return callback(null);
  });
}


/**
* Ensure plugin has the required thin interface
*
* @param <pluginModule> -- {Module} module of the plugin
* @return {Boolean} true/false
*/
function hasInterface(pluginModule) {
  var hasAcceptsFunc = lodash.isFunction(pluginModule.accepts);
  var hasProducesFunc = lodash.isFunction(pluginModule.produces);
  var hasRunFunc = lodash.isFunction(pluginModule.run);
  return (hasAcceptsFunc && hasProducesFunc && hasRunFunc);
}


/**
* Class for Plugin
*
* @param <name> -- {String} name of plugin
* @param <module> -- {Module} module of plugin
* @return {Plugin}
*/
function Plugin(name, module) {
  this._name = name;
  this._module = module;
  this._metadata = { };
  // try load some metadata
  try {
    var _path = path.resolve(utils.getPath("app.plugins"), name,
      "package.json");
    this._metadata = require(_path);
  } catch (err) { }
  return this;
}


/**
* Returns True/False if plugin handles datatype
*
* @param <datatype> -- {String} type of data
* @return {Boolean}
*/
Plugin.prototype.accepts = function(datatype) {
  var moduleAccepts = this._module.accepts();
  for (var idx = 0, le = moduleAccepts.length; idx < le; idx++) {
    if (moduleAccepts[idx] === datatype) { return true; }
  }
  return false;
};


/**
* Returns True/False if plugin produces any of the expected types
*
* @param <expects> -- {Array} the expected types
* @return {Boolean}
*/
Plugin.prototype.produces = function(expects) {
  var moduleProduces = this._module.produces();
  for (var idx = 0, le = expects.length; idx < le; idx++) {
    for (var i = 0, k = moduleProduces.length; i < k; i++) {
      if (expects[idx] === moduleProduces[i]) {
        return true;
      }
    }
  }
  return false;
};


/**
* Gets information about installed plugins
*
* @param <callback> -- {Function} callback(err, pluginsInfo)
* @callbackparam <pluginsInfo> -- {Array} an array of objects
*   representing plugin information
*/
exports.getPluginsInformation = getPluginsInformation;
function getPluginsInformation(callback) {
  var infos = [];
  registryRefresh(function() {
    var plugin;
    for (var pluginName in registry) {
      plugin = registry[pluginName];
      infos.push({
        name: plugin._name,
        description: plugin._module.description,
        metadata: plugin._metadata
      });
    }
    return callback(null, infos);
  }); // registryRefresh
}


})();
