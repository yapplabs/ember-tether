'use strict';

module.exports = {
  name: require('./package').name,

  options: {
    nodeAssets: {
      tether: {
        srcDir: 'dist',
        import: ['js/tether.js']
      }
    }
  }
};
