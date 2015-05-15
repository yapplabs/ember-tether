import Ember from 'ember';

const observer = Ember.observer;
const get = Ember.get;
const run = Ember.run;

export default Ember.Component.extend({
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

  didInsertElement: function() {
    this.addTether();
  },

  willDestroyElement: function() {
    var tether = this._tether;
    var element = this.element;
    run.schedule('render', () => {
      this.removeElement(element);
      this.removeTether(tether);
    });
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
      this._tether.setOptions(this._tetherOptions());
    }
  ),

  addTether: function() {
    this._tether = new Tether(this._tetherOptions());
  },

  removeTether: function(tether) {
    tether.destroy();
  },

  removeElement: function(element) {
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  },

  _tetherOptions: function() {
    let options = { element: this.element };
    options.target = get(this, 'target');
    if (Ember.View.detectInstance(options.target)) {
      options.target = options.target.element;
    }
    [ 'classPrefix',
      'attachment',
      'targetAttachment',
      'offset',
      'targetOffset',
      'targetModifier',
      'constraints',
      'optimizations'
    ].forEach((k) => {
      const v = get(this, k);
      if (!Ember.isNone(v)) {
        options[k] = v;
      }
    });
    return options;
  }
});
