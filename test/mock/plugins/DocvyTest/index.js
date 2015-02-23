/**
* A Sample Docvy extension
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


(function() {
"use strict";


exports.accepts = accepts;
function accepts() {
  return ["DocvyTestTypeRaw"];
};


exports.produces = produces;
function produces() {
  return ["DocvyTestTypeProcessed"];
}


exports.run = run;
function run(rawdata, expects, callback) {
  return callback(null, "DocvyTestTypeProcessed", rawdata);
}


})();
