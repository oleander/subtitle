import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('waiting', { path: '/' });
  this.route('loading', { path: '/loading' });
  this.route('not-okay', { path: '/not-okay' });
  this.route('okay', { path: '/okay' });
});

export default Router;
