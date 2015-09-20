export default Ember.Component.extend({
  tagName: "select",
  change: function(event) {
    this.sendAction("action", this.$(":checked").val());
  },
  focusOut: function() {
    this.change();
  },
  setCurrentSelected: function() {
    var value = this.get("selected");
    this.$(`option[value=${value}]`).prop('selected', true);
  }.on("didInsertElement")
});