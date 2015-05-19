/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-tether',

  included: function(app) {
    if (app.import) {
      this.importBowerDependencies(app);
    }
  },

  importBowerDependencies: function(app) {
    app.import(app.bowerDirectory + '/tether/js/utils.js');
    app.import(app.bowerDirectory + '/tether/js/tether.js');
    app.import(app.bowerDirectory + '/tether/js/abutment.js');
    app.import(app.bowerDirectory + '/tether/js/constraint.js');
  }
};
