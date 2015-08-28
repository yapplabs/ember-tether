import Ember from 'ember';
import EmberWormhole from 'ember-wormhole/components/ember-wormhole';
import layout from '../templates/components/ember-tether';

const { observer, get, run, computed } = Ember;

const { reads } = computed;

export default EmberWormhole.extend({
  layout: layout,
  classPrefix: 'ember-tether',
  target: null,
  attachment: null,
  targetAttachment: null,
  offset: null,
  targetOffset: null,
  targetModifier: null,
  constraints: null,
  optimizations: null,

  to: reads('wormholeTargetService.defaultTargets.emberTether'),

  didInsertElement: function() {
    this._super();

    this.addTether();
  },

  willDestroyElement: function() {
    this._super();

    var tether = this._tether;
    run.schedule('render', () => {
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
    'renderInPlace',
    'destinationName',
    function() {
      this.removeTether(this._tether);
      this.addTether();
    }
  ),

  addTether: function() {
    if (!this.get('renderInPlace') && get(this, '_tetherTarget')) {
      this._tether = new Tether(this._tetherOptions());
    }
  },

  removeTether: function(tether) {
    if (tether) {
      tether.destroy();
    }
  },

  _tetherTarget: computed('target', function() {
    let t = get(this, 'target');
    if (t && t.element) {
      t = t.element;
    }
    return t;
  }),

  _tetherOptions: function() {
    let options = {
      element: this._firstNode,
      target: get(this, '_tetherTarget'),
      moveRoot: false
    };
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
