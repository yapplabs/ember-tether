import Ember from 'ember';

const { observer, get, getOwner, run, computed, isNone, Component } = Ember;

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
    return getOwner(this).resolveRegistration('config:environment')['ember-tether'];
  }),
  bodyElement: computed(function() {
    let config = get(this, 'emberTetherConfig');
    if (config && config.bodyElementId) {
      return document.getElementById(config.bodyElementId);
    }
  }),
  didInsertElement() {
    this._super(...arguments);
    this.addTether();
  },

  willDestroyElement() {
    this._super(...arguments);
    const { _tether, element } = this;
    this.removeTether(_tether);
    this.moveElementBackIntoParent(element);
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
      // Tether moves our element in the DOM. This
      // causes Glimmer 2 to be very, very confused.
      // So, we save the original parent which we'll
      // append the element to after we remove tether in
      // removeElement
      this._originalParentNode = this.element.parentNode;
      this._tether = new Tether(this._tetherOptions());
    }
  },

  removeTether(tether) {
    if (tether) {
      tether.destroy();
    }
  },

  moveElementBackIntoParent(element) {
    // Remove the element from the body
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
    // For Glimmer 2 to work properly, we need to
    // to readd the element to the original parent
    this._originalParentNode.appendChild(element);
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
