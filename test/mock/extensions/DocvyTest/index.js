/**
* A Sample Docvy extension
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


(function() {
"use strict";


exports.accepts = ["DocvyTestType"];


exports.run = run;
function run(accepts, rawData, callback) {
  return callback(null, "text", rawData);
}


})();
