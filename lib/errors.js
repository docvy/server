/**
* Definition of Application-specific Errors
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


(function() {
"use strict";


// own-installed modules
var utils = require("./utils");


// definitions of errors
exports = module.exports = {
  cache: {
    RestoreError: utils.defineError("ECACHERST", "Cache item restore" +
      " failed")
  },
  plugins: {
    CrashError: utils.defineError("EPLUGINCRASH", "Plugin crashed"),
    HungError: utils.defineError("EPLUGINHUNG", "Plugin hung detected"),
    MissingError: utils.defineError("EPLUGINMISS", "Plugin missing")
  }
};


})(); // Wrapper
