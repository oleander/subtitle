var BrowserWindow = require("browser-window");
var app           = require("app");

app.on("ready", function() {

  mainWindow = new BrowserWindow({
    "min-width": 1200,
    "min-height": 800,
    height: 800,
    width: 1200,
    "web-preferences": {
      "web-security": false
    }
  });

  mainWindow.loadUrl("file://" + __dirname + "/index.html");
});