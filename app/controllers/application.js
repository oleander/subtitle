import search from "../lib/search";
var fs = nRequire("fs");

export default  Ember.Controller.extend({
  actions: {
    fileIsDroped: function(file) {
      var self = this;
      if(fs.lstatSync(file.path).isDirectory()) {
        this.transitionToRoute("not-okay");
        new Notification("Error", {
          body: "Folders are not supported"
        });
      } else {
        this.transitionToRoute("loading");
        search(file, "eng").then(function() {
          self.transitionToRoute("okay");
        }).catch(function(err) {
          new Notification("Error", { body: err });
          self.transitionToRoute("not-okay");
        })
      }
    }
  }
});