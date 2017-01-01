import Ember from 'ember';
const { run, Component } = Ember;

export default Component.extend({
  classNames: ['example-component'],

  didInsertElement() {
    run.schedule('afterRender', () => {
      if (this.isDestroying || this.isDestroyed) {
        return;
      }
      this.sendAction('registerComponentTarget', this);
    });
  }
});
