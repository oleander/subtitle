var langKeyToName = function(key) {
  return {
    "eng": "English",
    "swe": "Swedish"
  }[key]
};

export default Ember.Controller.extend({
  currentLang: function() {
    return langKeyToName(this.get("currentLangID"));
  }.property("currentLangID"),
  currentLangID: function() {
    return localStorage.getItem("language") || "eng";
  }.property(),
  isChangingLang: false,
  actions: {
    changeLang: function() {
      this.set("isChangingLang", true);
    },
    setLanguage: function(language) {
      localStorage.setItem("language", language);
      this.notifyPropertyChange("currentLangID");
      this.set("isChangingLang", false);
    }
  }
});
