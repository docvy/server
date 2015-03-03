/**
* Tests against The Docvy Command-line runner
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


(function() {
"use strict";


// npm-installed modules
var should = require("should");


// own modules
var errors = require("../lib/errors");


describe("errors.defineError()", function() {

  it("return an instance of an Error", function() {
    var _Error = errors.defineError("SAMPLE", "just sample error");
    should(new _Error()).be.an.instanceOf(Error);
  });

  it("sets an error code", function() {
    var code = "ECODE_JUMPY";
    var error = new (errors.defineError(code, "sample text"))();
    should(error.code).eql(code);
  });

  it("sets a default message", function() {
    var defaultMessage = "JUMPY BIRDY";
    var error = new (errors.defineError("EFOR", defaultMessage))();
    should(error.message).eql(defaultMessage);
  });

  it("allows custom message", function() {
    var _Error = errors.defineError("EFORME", "some message");
    var customMessage = "some custom, custom message";
    var error = new _Error(customMessage);
    should(error.message).eql(customMessage);
  });

  it.skip("allows setting parent errors", function() {
    var _Error_1 = errors.defineError("ERROR_1", "1st message");
    var _Error_2 = errors.defineError("ERROR_2", "2nd message");
    var error1 = new _Error_1();
    var error2 = new _Error_2(error1);
    should(error2.parent).be.an.instanceOf(Error).and.eql(error1);
  });

});


})(); // Wrapper
