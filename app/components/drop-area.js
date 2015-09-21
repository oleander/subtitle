export default Ember.Component.extend({
  id: "drop",
  drop: function(event) {
    event.preventDefault();
    this.sendAction("action", event.dataTransfer.files[0]);
  },
  dragOver: function(event) {
    event.preventDefault();
    event.originalEvent.dataTransfer.dropEffect = "copy";
  }
});