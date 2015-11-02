import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['example-component'],

  didInsertElement() {
    Ember.run.schedule('afterRender', () => {
      if (this.isDestroying || this.isDestroyed) {
        return;
      }
      this.sendAction('registerComponentTarget', this);
    });
  }
});
