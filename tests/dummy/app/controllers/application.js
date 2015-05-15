import Ember from 'ember';

const computed = Ember.computed;
const get = Ember.get;
const set = Ember.set;

export default Ember.Controller.extend({
  exampleTarget: 1,
  exampleTargetSelector: computed('exampleTarget', function() {
    return `#tether-target-${get(this, 'exampleTarget')}`;
  }),

  attachmentConfigurations: [
    { targetAttachment: 'top left', attachment: 'top right' },
    { targetAttachment: 'middle left', attachment: 'top right' },
    { targetAttachment: 'bottom left', attachment: 'top right' },
    { targetAttachment: 'bottom left', attachment: 'top center' },
    { targetAttachment: 'bottom middle', attachment: 'top center' },
    { targetAttachment: 'bottom right', attachment: 'top center' },
    { targetAttachment: 'bottom right', attachment: 'top left' },
    { targetAttachment: 'middle right', attachment: 'top left' },
    { targetAttachment: 'top right', attachment: 'top left' },
    { targetAttachment: 'top right', attachment: 'bottom left' },
    { targetAttachment: 'top center', attachment: 'bottom left' },
    { targetAttachment: 'top left', attachment: 'bottom left' }
  ],
  attachmentConfigurationIndex: 0,

  exampleTargetAttachment: computed('attachmentConfigurationIndex', function() {
    const i = get(this, 'attachmentConfigurationIndex');
    const config = get(this, 'attachmentConfigurations')[i];
    return config.targetAttachment;
  }),
  exampleAttachment: computed('attachmentConfigurationIndex', function() {
    const i = get(this, 'attachmentConfigurationIndex');
    const config = get(this, 'attachmentConfigurations')[i];
    return config.attachment;
  }),

  exampleOffset: null,
  exampleConstraintsOn: computed('exampleConstraints', function() {
    if (get(this, 'exampleConstraints')) {
      return 'on';
    } else {
      return 'off';
    }
  }),
  exampleConstraints: null,

  actions: {
    switchTether: function() {
      const dt = get(this, 'exampleTarget');
      const nt = dt === 7 ? 1 : dt + 1;
      set(this, 'exampleTarget', nt);
    },
    rotateTether: function() {
      const numConfigs = get(this, 'attachmentConfigurations').length;
      const i = get(this, 'attachmentConfigurationIndex');
      const nc = i === (numConfigs - 1) ? 0 : i + 1;
      set(this, 'attachmentConfigurationIndex', nc);
    },
    toggleOffset: function() {
      if (Ember.isNone(get(this, 'exampleOffset'))) {
        set(this, 'exampleOffset', '0 -20px');
      } else {
        set(this, 'exampleOffset', null);
      }
    },
    toggleConstraints: function() {
      if (Ember.isNone(get(this, 'exampleConstraints'))) {
        set(this, 'exampleConstraints', [{
          to: 'scrollParent',
          attachment: 'together',
          pin: true
        }]);
      } else {
        set(this, 'exampleConstraints', null);
      }
    }
  }
});
