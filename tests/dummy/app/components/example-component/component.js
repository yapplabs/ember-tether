import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['example-component'],

  didInsertElement() {
    this.sendAction('registerComponentTarget', this);
  }
});
