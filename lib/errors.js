/**
* Definition of Application-specific Errors
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


"use strict";


// own-installed modules
var utils = require("./utils");


// definitions of errors
exports = module.exports = {
  cache: {
    ItemRestoreError: utils.defineError("ECACHEITMREST", "Cache item" +
      " could not be restored")
  },
  plugins: {
    CrashError: utils.defineError("EPLUGINCRASH", "Plugin crashed"),
    HungError: utils.defineError("EPLUGINHUNG", "Plugin hung detected"),
    MissingError: utils.defineError("EPLUGINMISS", "Plugin missing")
  },
  registry: {
    RefreshError: utils.defineError("EREGREFRESH", "Registry" +
      " refreshing failed")
  }
};

