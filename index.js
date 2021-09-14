const fs = require("fs");
const path = require("path");
var http = require("http");

var originHTML = fs.readFileSync("test.html", 'utf8');

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

http
  .createServer(function (req, res) {
    res.writeHead(200, { "Content-Type": "html" });
    console.log(originHTML.split('</body>'))
    res.end(injectWebsocket(originHTML, INJECTED_CODE));
  })
  .listen(9615, () => {
    console.log("I'm listening...");
  });
