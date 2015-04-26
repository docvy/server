/**
* The Docvy Cache
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


"use strict";


// built-in modules
var fs = require("fs");


// npm-installed modules
var dCache = require("docvy-cache");


// own modules
var errors = require("../errors");
var utils = require("../utils");


/**
* Creates a unique key
* format A: <absoluteFilepath>:<contentType>
*   is used for file data that has been converted to <contentType>
* format B: <absoluteFilepath>
*   is used for the original file data (without conversion)
*
* @param <absoluteFilepath> -- {String} absolute filepath
* @param [contentType] -- {String} content type of the data
* @return {String}
*/
exports.composeKey = composeKey;
function composeKey(absoluteFilepath, contentType) {
  if (! contentType) { return absoluteFilepath; }
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


var Cache = (function() {
  /**
  * Constructor
  *
  * @param <options> -- {Object} options passed, as is, to Cache
  * @return {Cache}
  */
  function Cache(options, debug) {
    this._debug = utils.defineCallback(debug);
    this._cache = new dCache(options);
    this.proxy = this._cache;
    this._debug("new cache constructed");
    return this;
  }

  /**
  * Retrieve data from cache
  *
  * Given a set of expected content-types and the filepath we can
  * compose possible keys that the converted data has been stored in.
  *
  * @param <absoluteFilepath> -- {String} absolute filepath
  * @param <expects> -- {Array} the expected content types
  * @param <callback> -- {Function} callback(err, type, data)
  */
  Cache.prototype.getData =
  function(absoluteFilepath, expects, callback) {
    this._debug("getting data from cache");
    var _this = this;
    var index = 0;
    var mtime;
    var item = new Item();

    fs.stat(absoluteFilepath, function(err, stats) {
      if (err) { return callback(err); }
      mtime = stats.mtime.getTime();
      return next();
    });

    function next() {
      // no more possible keys
      if (index >= expects.length) {
        return callback(null, null, null);
      }
      var key = composeKey(absoluteFilepath, expects[index]);
      _this._cache.get(key, function(err, data) {
        if (err) {
          /**
          * This error is ignored as we shall try as hard as possible to
          * get the data, using other keys
          */
        }
        if (data) {
          try {
            item.restoreFromCache(data);
          } catch (jsonError) {
            err = new errors.cache.ItemRestoreError(jsonError);
            return callback(err);
          }
          if (! item.isValid(mtime)) {
            _this._cache.unset(key);
            return callback(null, null, null);
          }
          return callback(null, expects[index], item.data);
        }
        index++;
        return next();
      });
    }
  };


  /**
  * Set data into cache
  *
  * @param <absoluteFilepath> -- {String} absolute filepath
  * @param <contentType> -- {String} content type of data
  * @param <data> -- {String} processed data
  * @param <callback> -- {Function} callback(err)
  */
  Cache.prototype.setData =
  function(absoluteFilepath, contentType, data, callback) {
    this._debug("setting data into cache");
    var key = composeKey(absoluteFilepath, contentType);
    var item = new Item();
    item.setData(data);
    this._cache.set(key, item.asString(), function(err) {
      return callback(err);
    });
  };

  return Cache;
})();


exports.Item = Item;
exports.Cache = Cache;

