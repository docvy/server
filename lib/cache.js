/**
* The Docvy Cache
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


(function() {
"use strict";


// builtin modules
var fs = require("fs");


// npm-installed modules
var uuid = require("node-uuid");


// own modules
var utils = require("./utils");


// module variables
var cacheDir = utils.getPath("app.cache");


/**
* Creates a unique tag
* <absolute_filepath>:<content_type>
*
* @param <absolute_filepath> -- {String} absolute filepath
* @param <content_type> -- {String} content type of the data
* @return {String}
*/
function composeTag(absolute_filepath, content_type) {
  return "" + absolute_filepath + ":" + content_type;
}


/**
* A Cache item
*/
var Item = (function() {

  /**
  * Constructor
  *
  * @param <data> -- {String} processed data
  * @return {Item}
  */
  function Item(data) {
    this.mtime = Date.now();
    this.data = data;
    return this;
  }

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


/**
* Cache
*/
var Cache = (function() {

  function Cache() {
    this.keys = { };
    this.items = { };
    return this;
  }

  Cache.prototype.writeToDisk = function(callback) {
    var _this = this;
    var keyspath = path.join(cacheDir, "keys");
    fs.writeFile(keyspath, JSON.stringify(_this.keys), function(err) {
      if (err) { return callback(err); }
      var errors = [];
      for (var tag in _this.items) {
        fs.writeFile();
      }
    });

  };

  Cache.prototype.readFromDisk = function() { };

  Cache.prototype.getItem = function(tag, callback) {
    // option 1: choose from already retrieved items
    var id = this.keys[tag];
    var item = this.items[id];
    if (item) { return callback(null, item.data); }
    // option 2: read its file
    var filepath = path.join(cacheDir, id);
    fs.readFile(filepath, { encoding: "utf8" }, function(err, data) {
      if (err) { return callback(err); }
      try {
        var c = JSON.parse(data);
        item = this.items[id] = new Item(c.data, c.mtime);
        return callback(null, item);
      } catch (jsonErr) {
        return callback(jsonErr);
      }
    });
  };

  Cache.prototype.setItem = function(tag, data) {
    var id = uuid.v4();
    this.keys[tag] = id;
    this.items[id] = new Item(data);
  };

  return Cache;
})();


})(); // wrapper
