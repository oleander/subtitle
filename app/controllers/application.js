export default  Ember.Controller.extend({
  actions: {
    fileIsDroped: function(file) {
      // Folder?
      if(file.type == "") {
        this.transitionToRoute("not-okay");
      } else {
        this.transitionToRoute("loading");
        var self = this;
        setTimeout(function() {
          self.transitionToRoute("okay");
        }, 4000);
      }
    }
  }
});