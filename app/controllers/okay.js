export default Ember.Controller.extend({
  actions: {
    backToIndexPage: function() {
      this.transitionToRoute("waiting");
    }
  }
});