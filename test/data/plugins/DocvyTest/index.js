/**
* A Sample Docvy extension
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


(function() {
"use strict";


exports.description = "A Plugin for testing the docvy-server";


exports.accepts = accepts;
function accepts() {
  return ["DocvyTestTypeRaw"];
}


exports.produces = produces;
function produces() {
  return ["DocvyTestTypeProcessed"];
}


exports.run = run;
function run(rawdata, expects, callback) {
  switch (process.env.DOCVY_TEST_PLUGIN_MODE) {
  case "success":
    return callback(null, "DocvyTestTypeProcessed", rawdata);
  case "crash":
    throw new Error();
  case "hung":
    // do nothing: dont call callback
  }
}


})();
