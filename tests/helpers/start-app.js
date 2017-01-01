// jscs:disable disallowDirectPropertyAccess

import Ember from 'ember';
import Application from '../../app';
import config from '../../config/environment';
const { assign, merge } = Ember;
const emAssign = assign || merge; // older versions of Ember didn't have assign
export default function startApp(attrs) {
  let application;

  // use defaults, but you can override
  let attributes = emAssign({}, config.APP, attrs);

  Ember.run(() => {
    application = Application.create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();
  });

  return application;
}
