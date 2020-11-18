const commonjs = require("@rollup/plugin-commonjs");
const resolve = require("rollup-plugin-node-resolve");

module.exports = function (grunt) {
  grunt.initConfig({
    clean: {
      build: "build",
    },

    less: {
      debug: {
        files: {
          "build/style.css": "public/css/layout.less",
        },
      },
    },

    rollup: {
      debug: {
        options: {
          format: "iife",
          name: "mymodule",
          sourceMap: "inline",
          plugins: [resolve(), commonjs()],
          external: ["d3", /node_modules/],
          globals: { d3: "d3" },
        },
        files: {
          "./build/js/bundle.js": "./public/js/index.js",
        },
      },
    },
    watch: {
      rebuild: {
        files: ["public/**/*", "lib/**/*.js"],
        tasks: ["build:debug"],
      },

      livereload: {
        options: {
          livereload: true,
        },
        files: ["public/**/*.{css,js,less}"],
      },
    },
  });
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("gruntify-eslint");
  grunt.loadNpmTasks("grunt-contrib-less");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-rollup");

  grunt.registerTask("build:debug", "Compile", [
    "clean",
    // "jshint",
    "less:debug",
    "rollup",
  ]);
  grunt.registerTask("dev", ["build:debug", "watch"]);
};