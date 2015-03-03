/**
* Definition of Application-specific Errors
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


(function() {
"use strict";


// definitions of errors
exports = module.exports = {
  plugins: {
    CrashError: defineError("EPLUGINCRASH", "Plugin crashed"),
    HungError: defineError("EPLUGINHUNG", "Plugin hung detected"),
    MissingError: defineError("EPLUGINMISS", "Plugin missing")
  }
};


/**
* Define custom errors
*
* @param <code> -- {String} error code
* @param <message> -- {String} message
* @return {Error Constructor}
*/
exports.defineError = defineError;
function defineError(code, defaultMessage) {
  function _Error(message, parentError) {
    if (message instanceof Error) {
      parentError = message;
      message = null;
    }
    this.code = this.name = code.toUpperCase();
    this.message = message || defaultMessage;
//    this.parent = parentError || (new Error());
//    this.stack = this.parent.stack;
  }

  _Error.prototype = Object.create(Error.prototype);
  _Error.prototype.constructor = _Error;

  _Error.prototype.withoutStack = function() {
    var minimal = this;
    delete minimal.stack;
    return minimal;
  };

  return _Error;
}


})(); // Wrapper
