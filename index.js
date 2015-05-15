/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-tether',

  included: function(app) {
    app.options = app.options || {};
    app.options.emberTether = app.options.emberTether || {};
    var importDependencies = app.options.emberTether.excludeDependencies !== false;

    if (importDependencies) {
      this.throwIfNestedAddon(app);
      app.import(app.bowerDirectory + '/tether/js/utils.js');
      app.import(app.bowerDirectory + '/tether/js/tether.js');
      app.import(app.bowerDirectory + '/tether/js/abutment.js');
      app.import(app.bowerDirectory + '/tether/js/constraint.js');
    }
  },

  throwIfNestedAddon: function(app) {
    if (!app.import) {
      var message = 'ERROR (ember-tether): Attempting to import ' +
        '\'ember-tether\' bower dependencies will not work when nested ' +
        'in another addon. Please specify excludeDependencies: true in ' +
        'the emberTether config in index.js (for addons) or Brocfile.js (for ' +
        'apps). See instructions in the README.';
      throw(message);
    }
  }
};
