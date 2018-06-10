import { getOwner } from '@ember/application';
import { run } from '@ember/runloop';
import { computed, get, observer } from '@ember/object';
import { isNone } from '@ember/utils';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['ember-tether'],
  classPrefix: 'ember-tether',
  target: null,
  attachment: null,
  targetAttachment: null,
  offset: null,
  targetOffset: null,
  targetModifier: null,
  constraints: null,
  optimizations: null,
  emberTetherConfig: computed(function() {
    return (getOwner(this).resolveRegistration('config:environment') || {})['ember-tether'];
  }),
  bodyElement: computed(function() {
    let config = get(this, 'emberTetherConfig');
    if (config && config.bodyElementId) {
      return document.getElementById(config.bodyElementId);
    }
  }),
  attributeBindings: [
    'aria-atomic',
    'aria-busy',
    'aria-controls',
    'aria-current',
    'aria-describedby',
    'aria-details',
    'aria-disabled',
    'aria-errormessage',
    'aria-flowto',
    'aria-haspopup',
    'aria-hidden',
    'aria-invalid',
    'aria-keyshortcuts',
    'aria-label',
    'aria-labelledby',
    'aria-live',
    'aria-owns',
    'aria-relevant',
    'aria-roledescription'
  ],
  didInsertElement() {
    this._super(...arguments);
    this.addTether();
  },

  willDestroyElement() {
    this._super(...arguments);
    if (!this._tether) return;

    let { _tether, element } = this;
    run.schedule('render', () => {
      this.removeElement(element);
      this.removeTether(_tether);
    });
  },

  didRender() {
    this._super(...arguments);
    this.positionTether();
  },

  tetherDidChange: observer(
    'classPrefix',
    'target',
    'attachment',
    'targetAttachment',
    'offset',
    'targetOffset',
    'targetModifier',
    'constraints',
    'optimizations',
    function() {
      this.removeTether(this._tether);
      this.addTether();
    }
  ),

  positionTether() {
    if (this._tether) {
      this._tether.position();
    }
  },

  addTether() {
    if (get(this, '_tetherTarget')) {
      this._tether = new Tether(this._tetherOptions());
    }
  },

  removeTether(tether) {
    if (tether) {
      tether.destroy();
    }
  },

  removeElement(element) {
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  },

  _tetherTarget: computed('target', function() {
    let t = get(this, 'target');
    if (t && t.element) {
      t = t.element;
    }
    return t;
  }),

  _tetherOptions() {
    let options = {
      element: this.element,
      target: get(this, '_tetherTarget')
    };
    [ 'classPrefix',
      'attachment',
      'targetAttachment',
      'offset',
      'targetOffset',
      'targetModifier',
      'constraints',
      'optimizations',
      'bodyElement'
    ].forEach((k) => {
      let v = get(this, k);
      if (!isNone(v)) {
        options[k] = v;
      }
    });
    return options;
  }
});
