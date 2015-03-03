/**
* Utilities
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


(function() {
"use strict";


// built-in modules
var path = require("path");
var util = require("util");


// npm-installed modules
var dutils = require("docvy-utils");
var lodash = require("lodash");


// module vars
var config = require("./config.json");


// configuring utils
dutils.configure(config);


// Exporting the docvy-utils module
exports = module.exports = dutils;


// Exporting configurations
exports.config = lodash.cloneDeep(config);


/**
* Returns an array of accepted types
*
* @param <acceptString> -- {String} string of accepts
* @return {Array}
*/
exports.getAccepts = getAccepts;
function getAccepts(acceptString) {
  var whitespaces = [" ", "\n", "\t"];
  whitespaces.forEach(function(whitespace) {
    acceptString = acceptString.replace(whitespace, "");
  });
  var rawAcceptsArray = acceptString.split(",");
  var acceptsArray = [];
  rawAcceptsArray.forEach(function(accept) {
    acceptsArray.push(accept.split("/")[1]);
  });
  return acceptsArray;
}


/**
* Returns the datatype, given an extension
*
* @param <extname> -- {String} file extension name
* @return {String} datatype
*/
exports.getDatatype = getDatatype;
function getDatatype(extname) {
  if (extname === "") { return "*"; }
  return extname.replace(".", "");
}


})(); // Wrapper
