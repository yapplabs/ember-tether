/* jshint node: true */
'use strict';

var path = require('path');
var Funnel = require('broccoli-funnel');
var unwatchedTree  = require('broccoli-unwatched-tree');

module.exports = {
  name: 'ember-tether',

  included: function(app) {
    if (app.import) {
      this.importEmberTetherDependencies(app);
    }
  },

  importEmberTetherDependencies: function(app/*, parentAddon*/) {
    app.import('vendor/tether/js/tether.js');
  },

  treeForVendor: function() {
    return new Funnel(unwatchedTree(path.join(__dirname, 'node_modules/tether/dist')), {
      srcDir: '/',
      destDir: '/tether',
      files: [
        'js/tether.js'
      ]
    });
  },
};
