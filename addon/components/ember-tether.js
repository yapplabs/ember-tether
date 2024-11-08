import { getOwner } from '@ember/application';
import { schedule } from '@ember/runloop';
import { isNone } from '@ember/utils';
import Component from '@glimmer/component';
import Tether from 'tether';
import { action } from '@ember/object';

export default class EmberTetherComponent extends Component {
  _tether;
  element;

  get classPrefix() {
    return this.args.classPrefix || 'ember-tether';
  }

  get emberTetherConfig() {
    return (getOwner(this).resolveRegistration('config:environment') || {})[
      'ember-tether'
    ];
  }

  get bodyElement() {
    if (this.args.bodyElement) {
      return document.getElementById(this.args.bodyElement);
    }

    let config = this.emberTetherConfig;
    if (config && config.bodyElementId) {
      return document.getElementById(config.bodyElementId);
    }
    return undefined;
  }

  willDestroy() {
    super.willDestroy(...arguments);
    if (!this._tether) return;
    let { _tether, element } = this;
    schedule('render', () => {
      this.removeElement(element);
      this.removeTether(_tether);
    });
  }

  @action updateTether() {
    this.removeTether(this._tether);
    this.addTether();
  }

  @action
  positionTether() {
    this._tether?.position();
  }

  @action
  addTether(el = null) {
    // when called from did-insert modifier, el will be passed
    if (el) {
      this.element = el;
    }
    if (this._tetherTarget) {
      this._tether = new Tether(this._tetherOptions);
      this.positionTether();
    }
  }
  removeTether(tether) {
    tether?.destroy();
  }

  removeElement(element) {
    element.parentNode?.removeChild(element);
  }

  get _tetherTarget() {
    let t = this.args.target;
    if (t && t.element) {
      t = t.element;
    }
    return t;
  }

  get _tetherOptions() {
    let options = {
      element: this.element,
      target: this._tetherTarget,
      classPrefix: this.classPrefix,
    };
    if (this.bodyElement) {
      options.bodyElement = this.bodyElement;
    }
    [
      'attachment',
      'targetAttachment',
      'offset',
      'targetOffset',
      'targetModifier',
      'constraints',
      'optimizations',
    ].forEach((k) => {
      let v = this.args[k];
      if (!isNone(v)) {
        options[k] = v;
      }
    });
    return options;
  }
}
