const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");
const static = require("node-static");
const http = require("http");

// ==================================params=================================

// port: 3000,
// websocketPort: 9999,
// htmlPath: path.resolve(__dirname, "./test.html"),
// staticDir: './public'

// ===================================inject===================================

var INJECTED_CODE = fs.readFileSync(
  path.join(__dirname, "injected.html"),
  "utf8"
);
/**
 *
 * @param {string} originHTML
 * @param {string} injectHTML
 * @returns
 */
function injectWebsocket(originHTML, injectHTML) {
  var injectCandidates = [
    // RegExp(pattern, modifiers)
    // modifiers为i代表对大小写不敏感
    new RegExp("</body>", "i"),
    new RegExp("</svg>"),
    new RegExp("</head>", "i"),
  ];

  var injectTag = null;
  // find injectTag, don't need how position
  // 突然感觉，比起map、find，for循环虽然朴实无华，但是让人安心
  for (var i = 0; i < injectCandidates.length; ++i) {
    const match = injectCandidates[i].exec(originHTML);
    if (match) {
      injectTag = match[0];
      break;
    }
  }

  // replace
  // TODO: another way, 自己都看不下去的代码
  if (injectTag) {
    return (
      originHTML.split(injectTag)[0] +
      injectHTML +
      originHTML.split(injectTag)[1]
    );
  } else {
    console.log(
      "Oops, can't use this tools unless <body>, <svg> or <head> in your html file"
    );
  }

  return originHTML;
}

// ===============================listen file change=============================
// TODO: how do I restart the http server??? or how do I serve the changed html file after start server ??
// FIXED: see https://stackoverflow.com/questions/69181965/create-a-web-server-for-local-html-using-node
// see watcher

// =============================server=======================================

const Server = {
  start(options) {
    const { port, websocketPort, htmlPath, staticDir } = options;
    startHTTP(htmlPath, port, staticDir);
    startWebSocket(htmlPath, websocketPort);
  },
};

// http
// TODO:有考虑为image等static resource创建server，但是
// 1. 静态资源路径的不确定性
// 2. 光用http module写起来太繁琐，express倒是简单，但又涉及到之前逻辑重写
function startHTTP(htmlPath, port, staticDir) {
  http
    .createServer(function (req, res) {
      // static
      // 如何把资源serve的路径映射成本地文件路径一致?
      // 新的问题，这些资源的改变是否会涉及到页面重新加载?
      // const fileServer = new static.Server(staticDir)
      // fileServer.serve(req, res);
      // html
      if (req.url.match(/\/public/)) {
        const fileServer = new static.Server(staticDir);
        req
          .addListener("end", function () {
            fileServer.serve(req, res);
          })
          .resume();
      } else {
        var originHTML = fs.readFileSync(htmlPath, "utf8");
        res.writeHead(200, { "Content-Type": "html" });
        res.end(injectWebsocket(originHTML, INJECTED_CODE));
      }
    })
    .listen(port, function () {
      console.log(`listening on http://localhost:${port}`);
    });
}

// websocket
// TODO: how do i know websocket port in injectedhtml
// or can port adjust default?
function startWebSocket(htmlPath, port) {
  const wss = new WebSocket.Server({ port });
  wss.on("connection", function (ws) {
    ws.on("message", function (message) {
      console.log(`Received message => ${message}`);
    });
    watcher(htmlPath, {}, function () {
      //
      ws.send("reload");
    });
    ws.on("close", function (c, d) {
      console.log("disconnect " + c + " -- " + d);
    });
  });
}

// watcher
function watcher(path, options, callback) {
  fs.watch(path, options, function (eventName, fileName) {
    if (fileName) {
      console.log("Event : " + eventName);
      console.log(fileName + " file Changed ...");
      // TODO:这回考验的是模块拆分or架构？
      // 怎么使用websocket比较合理呢
      callback();
    } else {
      console.log("filename not provided or check file access permissions");
    }
  });
}

module.exports = Server;
