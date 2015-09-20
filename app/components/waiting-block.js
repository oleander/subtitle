export default Ember.Component.extend({
  setTimer: function() {
    var self = this;
    var id = setTimeout(function() {
      self.sendAction();
    }, 5000);
    self.set("id", id);
  }.on('didInsertElement'),
  clearTimer: function() {
    clearTimeout(this.get("id"));
  }.on("willDestroyElement")
});