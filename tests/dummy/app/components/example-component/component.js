import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class ExampleComponent extends Component {
  element;

  @action
  registerComponent(element) {
    this.element = element;
    // schedule('afterRender', () => {
    if (this.isDestroying || this.isDestroyed) {
      return;
    }
    // eslint-disable-next-line
      this.args.registerComponentTarget(this);
    // });
  }
}
