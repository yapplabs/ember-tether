export function initialize(container, application) {
  const emberTether = application.emberTether || {};
  const tetherContainerId = emberTether.defaultContainerId || 'tether-outlet';

  container.lookup('service:wormhole-target').addDefaultTarget('emberTether', tetherContainerId);
}

export default {
  name: 'add-tether-container',
  initialize: initialize
};
