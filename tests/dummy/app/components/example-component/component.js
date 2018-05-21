import { run } from '@ember/runloop';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['example-component'],

  didInsertElement() {
    run.schedule('afterRender', () => {
      if (this.isDestroying || this.isDestroyed) {
        return;
      }
      // eslint-disable-next-line
      this.sendAction('registerComponentTarget', this);
    });
  }
});
