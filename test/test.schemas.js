/**
* Tests against Server Responses
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


"use strict";


// npm-installed modules
var Jayschema = require("jayschema");
var request = require("request").defaults({json: true});
var should = require("should");


// own modules
var server = require("../lib/server");


// module variables
var schemaPath = __dirname + "/../schemas/";
var validator = new Jayschema(function(ref, callback) {
  return callback(null, require(schemaPath + ref));
});
var _port = 9080;
var _url = "http://localhost:" + _port;
var schemas = {
  file: require("../schemas/file"),
  files: require("../schemas/files"),
  pluginDescriptor: require("../schemas/plugin-descriptor"),
  pluginsInstall: require("../schemas/plugins.install"),
  pluginUninstall: require("../schemas/plugins.uninstall"),
  stop: require("../schemas/stop")
};


/**
* returns a valid Url
*
* @param <endpoint> -- {String} url endpoint
* @return {String} valid url
*/
function url(endpoint) {
  return _url + endpoint;
}


/**
* test response
*
* @param <method> -- {String} http method
* @param <reqOptions> -- {String} request options
* @param <schema> -- {Object} json schema
* @param <done> -- {Function} completion callback
*/
function testResponse(method, reqOptions, schema, done) {
  reqOptions.uri = url(reqOptions.uri);
  request[method](reqOptions, function(err, res, body) {
    should(err).not.be.ok;
    validator.validate(body, schema, function(errs) {
      should(errs).not.be.ok;
      done();
    }); // validator.validate
  }); // request[method]
}


describe("validate", function() {

  before(function(done) {
    server.start({ port: _port }, done);
  });

  it("/files/", function(done) {
    testResponse("get", { uri: "/files/" }, schemas.files, done);
  });

  it.skip("/file/", function(done) {
    testResponse("get", {
      uri: "/file/",
      qs: {
        filepath: __dirname + "/mock/data.txt"
      }
    }, schemas.file, done);
  });

  it("/plugins/list", function(done) {
    testResponse("get", { uri: "/plugins/list" },
      {
        plugins: {
          type: "array",
          items: schemas.pluginDescriptor
        }
      }, done);
  });

  it.skip("/plugins/install", function(done) {
    testResponse("post", { uri: "/plugins/install/" },
      schemas.pluginsInstall, done);
  });

  it.skip("/plugins/uninstall", function(done) {
    testResponse("del", { uri: "/plugins/uninstall/" },
      schemas.pluginsUninstall, done);
  });

  after(function(done) {
    testResponse("del", { uri: "/stop/" }, schemas.stop, done);
  });

});
