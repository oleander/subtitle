/* global require, module */
var EmberApp = require("ember-cli/lib/broccoli/ember-app");

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    minifyCSS: {
      enabled: false
    },
    minifyJS: {
      enabled: false
    },
    sourcemaps: {
      enabled: false
    }
  });

  app.import("bower_components/bootstrap/dist/css/bootstrap.css");
  app.import("bower_components/font-awesome/css/font-awesome.css");
  app.import("bower_components/font-awesome/fonts/fontawesome-webfont.ttf");

  return app.toTree();
};