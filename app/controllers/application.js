import search from "../lib/search";

export default  Ember.Controller.extend({
  actions: {
    fileIsDroped: function(file) {
      var self = this;
      // Folder?
      if(file.type == "") {
        this.transitionToRoute("not-okay");
      } else {
        this.transitionToRoute("loading");
        search(file, "eng").then(function() {
          self.transitionToRoute("okay");
        }).catch(function(err) {
          self.transitionToRoute("not-okay");
        })
      }
    }
  }
});