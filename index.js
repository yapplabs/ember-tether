'use strict';

var path = require('path');
var Funnel = require('broccoli-funnel');
var MergeTrees = require('broccoli-merge-trees');

module.exports = {
  name: 'ember-tether',
  included(app) {
    this._super.included.apply(this, arguments)

    let current = this;
    // Find our host application just like the private _findHost method does
    do {
      app = current.app || app;
    } while (current.parent.parent && (current = current.parent));

    app.import('vendor/tether/tether.js');
  },

  treeForVendor(vendorTree) {
    var TetherTree = new Funnel(path.dirname(require.resolve('tether')), {
      files: ['tether.js'],
      destDir: '/tether',
    });

    return new MergeTrees([vendorTree, TetherTree], {
      annotation: 'ember-tether: treeForVendor'
    });
  },
};
