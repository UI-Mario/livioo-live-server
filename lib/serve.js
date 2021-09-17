#!/usr/bin/env node
"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var program = require("commander");
var pkg = require("../package.json");
var server = require('./index');
// tips: generate ascii-img from http://patorjk.com/software/taag
var ASCII_IMG = String.raw(__makeTemplateObject(["\n    __    _       _\n   / /   (_)   __(_)___     ________  ______   _____  _____\n  / /   / / | / / / __    / ___/ _ / ___/ | / / _ / ___/\n / /___/ /| |/ / / /_/ /  (__  )  __/ /   | |/ /  __/ /\n/_____/_/ |___/_/____/  /____/___/_/    |___/___/_/\n"], ["\n    __    _       _\n   / /   (_)   __(_)___     ________  ______   _____  _____\n  / /   / / | / / / __ \\   / ___/ _ \\/ ___/ | / / _ \\/ ___/\n / /___/ /| |/ / / /_/ /  (__  )  __/ /   | |/ /  __/ /\n/_____/_/ |___/_/\\____/  /____/\\___/_/    |___/\\___/_/\n"]));
console.log(ASCII_IMG);
var options = {
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
    var port = parseInt(val);
    options.port = port;
})
    .option("--entry-file [value]", "the port server runs on", function (val) {
    options.htmlPath = val;
})
    .option("--static-dir [value]", "the static resources absolute dir path", function (val) {
    options.staticDir = val;
})
    .parse(process.argv);
server.start(options);
