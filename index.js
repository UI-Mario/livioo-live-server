const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");
var http = require("http");



// ===================================inject===================================
var originHTML = fs.readFileSync("test.html", "utf8");

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
const injectWebsocket = (originHTML, injectHTML) => {
  var injectCandidates = [
    // RegExp(pattern, modifiers)
    // modifiers为i代表对大小写不敏感
    new RegExp("</body>", "i"),
    new RegExp("</svg>"),
    new RegExp("</head>", "i"),
  ];

  var injectTag = null;
  // find injectTag, don't need how position
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
};

// ===============================listen file change=============================
// TODO: how do I restart the http server???


// =============================server=======================================

// http
http
  .createServer(function (req, res) {
    res.writeHead(200, { "Content-Type": "html" });
    res.end(injectWebsocket(originHTML, INJECTED_CODE));
  })
  .listen(3000, () => {
    console.log("I'm listening...");
  });


// websocket
// TODO: how do i know websocket port in injectedhtml
// or can port adjust default?
const wss = new WebSocket.Server({ port: 8080 });
wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    console.log(`Received message => ${message}`);
  });
  ws.send("ho!");
  ws.on("close", (c, d) => {
    console.log("disconnect " + c + " -- " + d);
  });
});
