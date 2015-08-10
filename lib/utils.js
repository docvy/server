/**
 * Utilities
 *
 * The MIT License (MIT)
 * Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
 */


"use strict";


// built-in modules
var path = require("path");


// npm-installed modules
var utils = require("docvy-utils");
var _ = require("lodash");


// module vars
var config = require("./config.json");


// Exporting the docvy-utils module
exports = module.exports = utils;


// Exporting configurations
exports.config = _.cloneDeep(config);


/**
 * Returns an array of accepted types
 *
 * @example
 * getAccepts("text/html"); // => ["html"]
 *
 * @param  {String} acceptString - string of accepts
 * @return {Array}
 */
exports.getAccepts = getAccepts;
function getAccepts(acceptString) {
  return acceptString.split(/\ |\n|\t/g);
}


/**
 * Returns the datatype, given an extension
 *
 * @param {String} filepath
 * @return {String} datatype
 */
exports.getDatatype = getDatatype;
function getDatatype(filepath) {
  var extname = path.basename(filepath);
  if (extname === "") { return "*"; }
  return extname.replace(".", "");
}
