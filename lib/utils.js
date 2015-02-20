/**
* Utilities
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


(function() {
"use strict";


// built-in modules
var util = require("util");


// npm-installed modules
var lodash = require("lodash");


// module vars
var config = require("./config.json");


// Exporting the built-in `util` module
exports = module.exports = lodash.cloneDeep(util);


/**
* Fills {object} with key-value pairs from {defaults}
*
* @param object -- {Object}    the user-defined options
* @param defaults -- {Object}    the default options
* @return {Object}    object filled with all the default options
*/
exports.fillObject = fillObject;
function fillObject(object, defaults) {
  "use strict";
  // if {object} is not defined, automatically use the {defaults}
  if (! lodash.isPlainObject(object)) { return defaults; }
  return _fillObject(defaults, object);

  // fills {source} with key-value pairs from {destination}
  function _fillObject(source, destination) {
    for (var key in source) {
      if (! destination[key]) {
        destination[key] = source[key];
        continue;
      }
      if (lodash.isPlainObject(source[key])) {
        _fillObject(source[key], destination[key]);
        continue;
      }
    }
    return destination;
  }

}


/**
* Returns options filled with {userOptions} and default options from config.json
*
* @param offset -- {String} an object offset
* @param userOptions -- {Any} options passed by user
* @return {Any}
*/
exports.getOptions = getOptions;
function getOptions(offset, userOptions) {
  "use strict";
  var defaultOptions = lodash.cloneDeep(config);

  // Returning all default options if called with zero args
  if ( (! offset || offset === "" || ! lodash.isString(offset)) && (! userOptions) ) {
    return defaultOptions;
  }

  if (lodash.isString(offset) && offset.length > 0) {
    offset = offset.split(".");
    for (var index = 0, length = offset.length; index < length; index++) {
      defaultOptions = defaultOptions[offset[index]];
    }
  }

  // Returning default options using an offset
  if (! userOptions) {
    return defaultOptions;
  }

  // Return options with defaults
  if (lodash.isPlainObject(defaultOptions) && lodash.isPlainObject(userOptions)) {
    return fillObject(userOptions, defaultOptions);
  } else {
    return userOptions;
  }
}


/**
* Define callback by returning <callback> if is a function, else return
* an empty function
*
* @param callback -- {Function} function passed by user
* @return {Function} callable function
*/
exports.defineCallback = defineCallback;
function defineCallback(callback) {
  if (lodash.isFunction(callback)) { return callback; }
  return function() {};
}


})(); // Wrapper
