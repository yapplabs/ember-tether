/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-tether',

  options: {
    nodeAssets: {
      tether: {
        srcDir: 'dist',
        import: ['js/tether.js']
      }
    }
  }
};
