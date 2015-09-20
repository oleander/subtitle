export default Ember.Component.extend({
  setTimer: function() {
    var self = this;
    var id = setTimeout(function() {
      self.sendAction();
    }, 5000);
    self.set("id", id);
  }.on('didInsertElement'),
  clearTimer: function() {
    console.info("clear")
    clearTimeout(this.get("id"))
  }.on("willDestroyElement")
});