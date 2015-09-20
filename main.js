var BrowserWindow = require("browser-window");
var app           = require("app");
var Menu          = require("menu");

app.on("ready", function() {
  var mainWindow = new BrowserWindow({
    resizable: true,
    // height: 220,
    // width: 310,
    "web-preferences": {
      "web-security": false
    }
  });

  mainWindow.maximize();
  // mainWindow.openDevTools();
  mainWindow.setMenuBarVisibility(false);
  mainWindow.setAutoHideMenuBar(true);
  mainWindow.setSkipTaskbar(true);
  mainWindow.setTitle("Subtitle");
  // mainWindow.setAlwaysOnTop(true);
  // mainWindow.loadUrl("file://" + __dirname + "/index.html");
  mainWindow.loadUrl("http://localhost:4200/");
  mainWindow.openDevTools();


  mainWindow.on('closed', function() {
    app.quit();
  });

  var template = [
    {
      label: 'Subtitle',
      submenu: [
        {
          label: 'About Subtitle',
          selector: 'orderFrontStandardAboutPanel:'
        }
      ]
    },
    {
      label: 'Quit',
      accelerator: 'Command+Q',
      click: function() { app.quit(); }
    },
  ]
  menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
});

app.on("activate-with-no-open-windows", function() {
  app.quit();
});