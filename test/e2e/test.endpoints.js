/**
 * Tests against Server Responses
 *
 * The MIT License (MIT)
 * Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
 */


"use strict";


// built-in modules
var path = require("path");


// npm-installed modules
var Jayschema = require("jayschema");
var request = require("request").defaults({ json: true });
var rooted = require("rooted");
var should = require("should");


// own modules
var server = rooted("lib/server");


// module variables
var schemaPath = path.join(__dirname, "/../../schemas/");
var validator = new Jayschema(function(ref, callback) {
  return callback(null, require(schemaPath + ref));
});
var _port = 9080;
var _url = "http://localhost:" + _port;
var schemas = {
  file: rooted("schemas/file"),
  files: rooted("schemas/files"),
  pluginDescriptor: rooted("schemas/plugin-descriptor"),
  pluginsInstall: rooted("schemas/plugins.install"),
  pluginUninstall: rooted("schemas/plugins.uninstall"),
  stop: rooted("schemas/stop"),
};


/**
 * returns a valid Url
 *
 * @param  {String} endpoint
 * @return {String} valid url
 */
 function url(endpoint) {
  return _url + endpoint;
}


/**
 * test response
 *
 * @param {String} method - http method
 * @param {String} reqOptions - request options
 * @param {Object} schema - json schema
 * @param {Function} done - completion callback
 */
function testResponse(method, reqOptions, schema, done) {
  reqOptions.uri = url(reqOptions.uri);
  request[method](reqOptions, function(err, res, body) {
    should(err).not.be.ok();
    validator.validate(body, schema, function(errs) {
      should(errs).not.be.ok();
      done();
    }); // validator.validate
  }); // request[method]
}


describe("validate endpoint reponses", function() {
  before(function(done) {
    server.start({ port: _port }, done);
  });

  after(function(done) {
    testResponse("del", { uri: "/stop/" }, schemas.stop, done);
  });

  it("/files/", function(done) {
    testResponse("get", {
      uri: "/files/",
      qs: {
        path: __dirname,
      },
    }, schemas.files, done);
  });

  it("/file/", function(done) {
    testResponse("get", {
      uri: "/file/",
      qs: {
        path: __filename,
      },
    }, schemas.file, done);
  });

  it("/plugins/list", function(done) {
    testResponse("get", { uri: "/plugins/list" },
      {
        plugins: {
          type: "array",
          items: schemas.pluginDescriptor,
        },
      }, done);
  });

  it.skip("/plugins/install", function(done) {
    testResponse("post", { uri: "/plugins/install/" }, schemas.pluginsInstall, done);
  });

  it.skip("/plugins/uninstall", function(done) {
    testResponse("del", { uri: "/plugins/uninstall/" }, schemas.pluginsUninstall, done);
  });
});
