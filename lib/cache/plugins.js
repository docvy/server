/**
* Cache for the Plugins Handler
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


/**
* This cache is used by the plugins handler to save converted data.
* This helps avoid having to convert the file data repeatedly during
* the current session and following sessions. The data is saved
* to disk as it avoids having to read the origin file and converting
* the data.
*/


"use strict";


// npm-installed modules
var debug = require("debug")("docvy:server:cache:plugins");


// own modules
var dutils = require("../utils");
var utils = require("./utils");


// module variables
var cacheDir = dutils.getPath("app.cache.plugins");
var options = {
  cacheDir: cacheDir,
  waitForRestore: true
};
var cache;


// our cache
cache = new utils.Cache(options, debug);


// restoring cache
cache.proxy.restore(function(err) {
  // our cache has errored restoring, we just ignore it for now
  if (err) { return debug("cache errored while restoring: %j", err); }
  debug("cache restored successfully");
});


/**
* This would not work since only synchronous functions will be
* completed successfully in this callback
*
> process.on("exit", function() {
...   cache.save(function(err) {
...     if (err) {
...       return debug("cache saving failed");
...     }
...     return debug("cache saved successfully");
...   });
... });
*/


exports = module.exports = cache;

