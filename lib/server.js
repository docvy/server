(function() {
"use strict";

// built-in modules
var fs = require("fs");
var http = require("http");


// npm-installed modules
var debug = require("debug")("docvy:server");
var express = require("express");


// module variables
var app = express();
var server = http.Server(app);


// Serving our static assets
app.use(express.static(__dirname + '../assets/'));


// Browsing files in the file system
app.get("/files/:filepath", function(req, res, next) {
  debug("reading directory");
  fs.readdir(req.params.filepath, function(err, files) {
    if (err) { return next(err); }
    res.json({
      files: files
    });
  });
});


// Spinning our server
server.listen(8080, function() {
  debug("server started...");
});

})();
