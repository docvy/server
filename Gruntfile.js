/**
* Run script for Grunt, task runner
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


exports = module.exports = function(grunt) {
  "use strict";

  grunt.initConfig({
    csslint: {
      all: {
        src: ["assets/css/*"],
        options: {
          csslintrc: ".csslintrc"
        }
      }
    },
    jshint: {
      all: ["Gruntfile.js", "lib/*.js", "test/*.js", "assets/js/*.js"],
      options: {
        jshintrc: ".jshintrc"
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          quiet: false,
          clearRequireCache: false
        },
        src: ['test/test.*.js']
      }
    },
    sass: {
      all: {
        src: ["[A-z]*.sass"],
        dest: "assets/css",
        cwd: "assets/sass",
        expand: true,
        ext: ".css",
        extDot: "first",
        options: { sourcemap: "none" }
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-csslint");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-sass");
  grunt.loadNpmTasks("grunt-mocha-test");

  grunt.registerTask("compile", ["sass"]);
  grunt.registerTask("test", ["compile", "csslint", "jshint", "mochaTest"]);

};
