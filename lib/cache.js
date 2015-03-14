/**
* The Docvy Cache
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


(function() {
"use strict";


// built-in modules
var fs = require("fs");


// npm-installed modules
var debug = require("debug")("docvy:server:cache");
var Cache = require("docvy-cache");


// own modules
var utils = require("./utils");


// module variables
var cacheDir = utils.getPath("app.cache");
var cache = new Cache({
  cacheDir: cacheDir,
  waitForRestore: true
});


// restoring cache
cache.restore(function(err) {
  // our cache has errored restoring, we just ignore it for now
  if (err) { return debug("cache errored while restoring: %j", err); }
  debug("cache restored successfully");
});


/**
* Creates a unique key
* <absoluteFilepath>:<content_type>
*
* @param <absoluteFilepath> -- {String} absolute filepath
* @param <contentType> -- {String} content type of the data
* @return {String}
*/
function composeKey(absoluteFilepath, contentType) {
  return "" + absoluteFilepath + ":" + contentType;
}


/**
* A Cache item
*/
var Item = (function() {

  /**
  * Constructor
  *
  * @param [data] -- {String} processed data
  * @return {Item}
  */
  function Item() {
    this.mtime = Date.now();
    this.data = null;
    return this;
  }

  /**
  * Sets data
  *
  * @param <data> -- {String}
  */
  Item.prototype.setData = function(data) {
    this.data = data;
  };


  /**
  * Restore from a previously-saved data from cache
  *
  * @param <data> -- {String} data from cache
  * @return {Item}
  *
  * @throws JSON Parse Error
  */
  Item.prototype.restoreFromCache = function(data) {
    data = JSON.parse(data);
    var mtime = Number(data.mtime);
    if (mtime) { this.mtime = mtime; }
    if (data.data) { this.data = data.data; }
  };

  /**
  * Returns boolean to indicate whether the cache item is still valid
  *
  * @param <mtime> -- {UnixTime} data's last modification time
  * @return {Boolean}
  */
  Item.prototype.isValid = function(mtime) {
    return this.mtime > Number(mtime);
  };

  /**
  * Returns a String representation
  */
  Item.prototype.asString = function() {
    return JSON.stringify({
      mtime: this.mtime,
      data: this.data
    });
  };

  return Item;
})();



/**
* Retrieve data from cache
*
* @param <absoluteFilepath> -- {String} absolute filepath
* @param <expects> -- {Array} the expected content types
* @param <callback> -- {Function} callback(err, data)
*/
exports.getData = getData;
function getData(absoluteFilepath, expects, callback) {
  var index = 0;
  var mtime;
  var item = new Item();
  fs.stat(absoluteFilepath, function(err, stats) {
    if (err) { return callback(err); }
    mtime = stats.mtime.getTime();
    return next();
  });

  function next() {
    if (index >= expects.length) { return callback(null); }
    var key = composeKey(absoluteFilepath, expects[index]);
    cache.get(key, function(err, data) {
      if (data) {
        try {
          item.restoreFromCache(data);
        } catch (jsonError) {
          return callback(jsonError);
        }
        if (! item.isValid(mtime)) { return callback(null, null); }
        return callback(item.data);
      }
      return next();
    });
  }
}


/**
* Set data into cache
*
* @param <absoluteFilepath> -- {String} absolute filepath
* @param <contentType> -- {String} content type of data
* @param <data> -- {String} processed data
* @param <callback> -- {Function} callback(err)
*/
exports.setData = setData;
function setData(absoluteFilepath, contentType, data, callback) {
  var key = composeKey(absoluteFilepath, contentType);
  var item = new Item();
  item.setData(data);
  cache.set(key, item.asString(), function(err) {
    return callback(err);
  });
}


})(); // wrapper
