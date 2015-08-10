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


"use strict";


module.exports = exports = {
  handle: handle,
};


// built-in modules
var domain = require("domain");
var fs = require("fs");
var path = require("path");


// npm-installed modules
var debug = require("debug")("docvy:server:plugins");
var _ = require("lodash");


// own modules
var errors = require("./errors");
var utils = require("./utils");


// module variables
var pluginsDirectory = utils.getPath("app.plugins");
var registry = { };


/**
 * Handles different content types using plugins
 *
 * @param {String} datatype - type of data
 * @param {String} rawData - file data
 * @param {Array} expects - expected types
 * @param {Function} callback - callback(err, outputType, processedData)
 */
function handle(datatype, rawdata, expects, callback) {
  debug("attempting to handle data of type: %s", datatype);
  registryLookup(datatype, expects, function(lookupErr, plugin) {
    if (lookupErr) {
      return callback(lookupErr);
    }

    var pluginDomain = domain.create();
    var pluginHangTimeout;

    // plugin hang detection
    pluginHangTimeout = setTimeout(function() {
      debug("plugin hung detected, disposing plugin's domain");
      pluginDomain.dispose();
      return callback(new errors.plugins.HungError());
    }, utils.config.plugins.timeout_ms);

    // plugin error
    pluginDomain.on("error", function(domainError) {
      debug("plugin crashed: %s", plugin._name);
      pluginHangTimeout.close();
      return callback(new errors.plugins.CrashError(domainError));
    });

    // plugin execution
    pluginDomain.run(function() {
      debug("running plugin: %s", plugin._name);
      plugin._module.run(rawdata, expects, function(runErr, _type, pData) {
        pluginHangTimeout.close();
        return callback(runErr, _type, pData);
      });
    });

  }); // registryLookup
}


/**
 * Looks for plugin from Registry
 *
 * @param {String} datatype - type of data in file
 * @param {Array} expects - array of expected types
 * @param {Function} callback - callback(err, plugin)
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
  if (!lookup()) {
    // refresh registry
    registryRefresh(function(refreshErr) {
      if (refreshErr) {
        debug("error refreshing registry");
        return callback(new errors.registry.RefreshError());
      }

      // lookup in registry again for plugin
      if (!lookup()) {
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
 * @param {Function} callback - callback(err)
 *
 * Notes:
 * We shall NOT treat a registry refresh as a failure just because one or
 * more plugins could not be loaded.
 */
function registryRefresh(callback) {
  debug("refreshing registry");
  fs.readdir(pluginsDirectory, function(readdirErr, files) {
    if (readdirErr) {
      return callback(readdirErr);
    }
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
 * @param  {Module} pluginModule - module of the plugin
 * @return {Boolean} true/false
 */
function hasInterface(pluginModule) {
  var hasAcceptsFunc = _.isFunction(pluginModule.accepts);
  var hasProducesFunc = _.isFunction(pluginModule.produces);
  var hasRunFunc = _.isFunction(pluginModule.run);
  return (hasAcceptsFunc && hasProducesFunc && hasRunFunc);
}


/**
 * Class for Plugin
 *
 * @param  {String} name - name of plugin
 * @param  {Module} _module - module of plugin
 * @return {Plugin}
 */
function Plugin(name, _module) {
  this._name = name;
  this._module = _module;
  return this;
}


/**
 * Returns True/False if plugin handles datatype
 *
 * @param  {String} datatype - type of data
 * @return {Boolean}
 */
Plugin.prototype.accepts = function accepts(datatype) {
  var moduleAccepts = this._module.accepts();
  for (var idx = 0, le = moduleAccepts.length; idx < le; idx++) {
    if (moduleAccepts[idx] === datatype) { return true; }
  }
  return false;
};


/**
 * Returns True/False if plugin produces any of the expected types
 *
 * @param  {Array} expects - the expected types
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
