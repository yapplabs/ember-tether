'use strict';

module.exports = {
  name: 'ember-tether',

  included: function() {
    this._super.included.apply(this, arguments);
    this.import('node_modules/tether/dist/js/tether.js');
  },
};
