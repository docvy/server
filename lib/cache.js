/**
* The Docvy Cache
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


(function() {
"use strict";


// npm-installed modules
var uuid = require("node-uuid");
var Cache = require("docvy-cache");


// own modules
var utils = require("./utils");


// module variables
var cacheDir = utils.getPath("app.cache");
var cache = new Cache({ cacheDir: cacheDir });
var isRestored = false;


// restoring cache
cache.restore(function(err) {
  
});


/**
* Creates a unique tag
* <absoluteFilepath>:<content_type>
*
* @param <absoluteFilepath> -- {String} absolute filepath
* @param <contentType> -- {String} content type of the data
* @return {String}
*/
function composeTag(absoluteFilepath, contentType) {
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
  function Item(data) {
    this.mtime = Date.now();
    this.data = data || null;
    return this;
  }

  /**
  * Restore from a previously-saved data from cache
  *
  * @param <data> -- {String} data from cache
  * @return {Item}
  */
  Item.prototype.fromCache = function(data) {
    try {
      data = JSON.parse(data);
      var mtime = Number(data.mtime);
      if (mtime) { this.mtime = mtime; }
      if (data.data) { this.data = data.data; }
    } catch (jsonError) {
      throw new errors.cache.RestoreError();
    }
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

  return Item;
})();


})(); // wrapper
