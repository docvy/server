/**
* Cache for the File System Handler
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


/**
* This cache is only used by the file system handler to avoid making
* numerous I/O operations. Instead of having to read the same file
* repeatedly, we read it once, store its data and modification time.
* When we encounter the same file, we check if the file has been
* modified. If it has been modified, we return `null`.
* If not modified yet, we return the data in cache. Performance
* improvement by using this  cache is grounded on the low
* probability of the file content to be  modified while the application
* is running. The content of file is set into  the cache
* and kept there for just the current session. The cache is
* not saved to Disk
*/


"use strict";


// npm-installed modules
var debug = require("debug")("docvy:server:cache:fs");


// own modules
var utils = require("./utils");


// module variables
var cache;


/**
* We shall create a new cache here
* This cache does not require a cache directory as it will NOT be
* restored or saved
*/
cache = new utils.Cache(undefined, debug);


/**
* Although this may seem useless, we shall explicitly destroy the cache
* as an illustration of our committment to NOT saving this cache to
* disk
*/
process.on("exit", function() {
  cache.proxy.destroy();
});


exports = module.exports = cache;

