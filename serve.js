#!/usr/bin/env node

const program = require("commander");
const pkg = require("./package.json");

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
  host: null,
  port: null,
  HTMLfilePath: null,
};

program
  .version(pkg.version)
  .usage("[options] <file ...>")
  .option("-i, --integer <n>", "An integer argument", function (val) {
    console.log(val);
  })
  .option("-l, --list", "A list", function () {
    console.log(123);
  })
  .option("-o, --optional", "An optional value", function () {
    console.log(456);
  })
  .option("--port <n>", "the port server run on", function (val) {
    options.port = val;
  })
  .option(
    "-c, --collect [value]",
    "A repeatable value",
    function (val, memo) {
      memo.push(val);
      return memo;
    },
    []
  )
  .parse(process.argv);
