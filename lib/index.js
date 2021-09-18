"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var ws_1 = __importDefault(require("ws"));
var http_1 = __importDefault(require("http"));
var INJECTED_CODE = fs_1.default.readFileSync(path_1.default.join(__dirname, "injected.html"), "utf8");
function injectWebsocket(originHTML, injectHTML) {
    var injectCandidates = [
        new RegExp("</body>", "i"),
        new RegExp("</svg>"),
        new RegExp("</head>", "i"),
    ];
    var injectTag = null;
    for (var i = 0; i < injectCandidates.length; ++i) {
        var match = injectCandidates[i].exec(originHTML);
        if (match) {
            injectTag = match[0];
            break;
        }
    }
    if (injectTag) {
        return (originHTML.split(injectTag)[0] +
            injectHTML +
            originHTML.split(injectTag)[1]);
    }
    else {
        console.log("Oops, can't use this tools unless <body>, <svg> or <head> in your html file");
    }
    return originHTML;
}
var Server = {
    start: function (options) {
        var port = options.port, websocketPort = options.websocketPort, htmlPath = options.htmlPath, staticDir = options.staticDir;
        startHTTP(htmlPath, port, staticDir);
        startWebSocket(htmlPath, websocketPort, staticDir);
    },
};
function startHTTP(htmlPath, port, staticDir) {
    http_1.default
        .createServer(function (request, response) {
        var _a;
        var keyword = new RegExp(path_1.default.parse(staticDir).base);
        if ((_a = request === null || request === void 0 ? void 0 : request.url) === null || _a === void 0 ? void 0 : _a.match(keyword)) {
            var filePath = "." + request.url;
            var extname = String(path_1.default.extname(filePath)).toLowerCase();
            var mimeTypes = {
                ".html": "text/html",
                ".js": "text/javascript",
                ".css": "text/css",
                ".json": "application/json",
                ".png": "image/png",
                ".jpg": "image/jpg",
                ".gif": "image/gif",
                ".svg": "image/svg+xml",
                ".wav": "audio/wav",
                ".mp4": "video/mp4",
                ".woff": "application/font-woff",
                ".ttf": "application/font-ttf",
                ".eot": "application/vnd.ms-fontobject",
                ".otf": "application/font-otf",
                ".wasm": "application/wasm",
            };
            var contentType = mimeTypes[extname] || "application/octet-stream";
            fs_1.default.readFile(filePath, function (error, content) {
                if (error) {
                    if (error.code == "ENOENT") {
                        fs_1.default.readFile("./404.html", function (error) {
                            if (error) {
                                console.log("no 404 provided, read " + filePath + " error");
                            }
                            response.writeHead(404, { "Content-Type": "text/html" });
                            response.end("404", "utf-8");
                        });
                    }
                    else {
                        response.writeHead(500);
                        response.end("Sorry, check with the site admin for error: " +
                            error.code +
                            " ..\n");
                    }
                }
                else {
                    response.writeHead(200, { "Content-Type": contentType });
                    response.end(content, "utf-8");
                }
            });
        }
        else {
            var originHTML = fs_1.default.readFileSync(htmlPath, "utf8");
            response.writeHead(200, { "Content-Type": "html" });
            response.end(injectWebsocket(originHTML, INJECTED_CODE));
        }
    })
        .listen(port, function () {
        console.log("listening on http://localhost:" + port);
    });
}
function startWebSocket(htmlPath, port, staticDir) {
    var wss = new ws_1.default.Server({ port: port });
    wss.on("connection", function (ws) {
        ws.on("message", function (message) {
            console.log("Received message => " + message);
        });
        watcher(htmlPath, {}, function () {
            ws.send("reload");
        });
        watcher(staticDir, {}, function () {
            ws.send("reload");
        });
        ws.on("close", function (c, d) {
            console.log("disconnect " + c + " -- " + d);
        });
    });
}
function watcher(path, options, callback) {
    try {
        fs_1.default.watch(path, options, function (eventName, fileName) {
            if (fileName) {
                console.log("Event : " + eventName);
                console.log(fileName + " file Changed ...");
                callback();
            }
            else {
                console.log("filename not provided or check file access permissions");
            }
        });
    }
    catch (error) {
        if (error.code == "ENOENT") {
            console.log("Oops, no file or dir provided " + path);
        }
        else {
            console.log("there is an error when watch file", error);
        }
    }
}
exports.default = Server;
