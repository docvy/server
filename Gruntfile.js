/**
* Run script for Grunt, task runner
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


exports = module.exports = function(grunt) {
  "use strict";

  grunt.initConfig({
    jshint: {
      options: require("./.jshintrc.json"),
      main:  ["Gruntfile.js", "lib/**/*.js", "bin/docvy-server"],
      test: {
        options: require("./test/.jshintrc.json"),
        src: ["test/**/*.js"]
      }
    },
    mochaTest: {
      unit: {
        options: {
          reporter: 'spec',
          quiet: false,
          clearRequireCache: false
        },
        src: ['test/**/test.*.js']
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-mocha-test");

  grunt.registerTask("test", ["jshint", "mochaTest"]);

};
