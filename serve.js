#!/usr/bin/env node

const program = require("commander");
const pkg = require("./package.json");
const server = require('./src/index.js');

// tips: generate ascii-img from http://patorjk.com/software/taag
const ASCII_IMG = String.raw`
    __    _       _
   / /   (_)   __(_)___     ________  ______   _____  _____
  / /   / / | / / / __ \   / ___/ _ \/ ___/ | / / _ \/ ___/
 / /___/ /| |/ / / /_/ /  (__  )  __/ /   | |/ /  __/ /
/_____/_/ |___/_/\____/  /____/\___/_/    |___/\___/_/
`;


console.log(ASCII_IMG);

const options = {
  port: 3000,
  websocketPort: 9999,
  htmlPath: "./index.html",
  // FIXME: absolute path
  staticDir: "./public"
};

program
  .version(pkg.version)
  .usage("[options] <file ...>")
  .option("-l, --list", "A list", function () {
    console.log(123);
  })
  .option("-p, --port [value]", "the port server runs on", function (val) {
      const port = parseInt(val)
      options.port = port
  })
  .option("--entry-file [value]", "the port server runs on", function (val) {
    options.htmlPath = val
  })
  .option("--static-dir [value]", "the static resources absolute dir path", function (val) {
    options.staticDir = val
  })
  .parse(process.argv);

server.start(options)
