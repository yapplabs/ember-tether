'use strict';
const VersionChecker = require('ember-cli-version-checker');

module.exports = {
  name: 'ember-tether',

  init() {
    this._super.init.apply(this, arguments);
    let checker = new VersionChecker(this);

    checker.for('ember-cli').assertAbove('2.16.0', 'To use ember-tether you must have ember-cli 2.16+');
  },

  included: function() {
    this._super.included.apply(this, arguments);
    this.import('node_modules/tether/dist/js/tether.js');
  },
};
