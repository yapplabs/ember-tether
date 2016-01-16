import Ember from 'ember';
import QUnit from 'qunit';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import TestTransitionModule from 'dummy/modules/test-transition-module';

let application, viewRegistry;
const { assert } = QUnit;
const { abs } = Math;
const { set } = Ember;

module('Acceptance | tether test', {
  beforeEach() {
    application = startApp();
    viewRegistry = application.__container__.lookup('-view-registry:main');

    // for < 1.12.0 support
    if (!viewRegistry) {
      viewRegistry = Ember.View.views;
    }
  },

  afterEach() {
    Ember.run(application, 'destroy');
  }
});

assert.topAligned = function(thingSelector, targetSelector) {
  const thing = Ember.$(thingSelector);
  const target = Ember.$(targetSelector);
  const topDifference = abs(thing.offset().top - target.offset().top);
  const withinOnePixel = topDifference < 1;
  assert.ok(withinOnePixel, `${thingSelector} top within one pixel of ${targetSelector} top`);
};
assert.leftOf = function(thingSelector, targetSelector) {
  const thing = Ember.$(thingSelector);
  const target = Ember.$(targetSelector);
  const leftOf = thing.offset().left < target.offset().left;
  assert.ok(leftOf, `${thingSelector} left of ${targetSelector}`);
};
assert.rightOf = function(thingSelector, targetSelector) {
  const thing = Ember.$(thingSelector);
  const target = Ember.$(targetSelector);
  const leftOf = thing.offset().left > target.offset().left;
  assert.ok(leftOf, `${thingSelector} right of ${targetSelector}`);
};
assert.classPresent = function(thingSelector, className) {
  const thing = Ember.$(thingSelector);
  assert.ok(thing.attr('class').indexOf(className) > -1);
};
assert.classAbsent = function(thingSelector, className) {
  const thing = Ember.$(thingSelector);
  assert.ok(thing.attr('class').indexOf(className) <= -1);
};

function getTetherComponent(selector) {
  // jscs:disable
  const anotherEl = Ember.$(selector)[0];
  // jscs:enable
  return viewRegistry[anotherEl.id];
}

test('tethering a thing to a target', function(assert) {
  visit('/');

  andThen(function() {
    assert.topAligned('.tethered-thing', '#tether-target-1');
    assert.rightOf('.tethered-thing', '#tether-target-1');

    assert.topAligned('.another-tethered-thing', '#tether-target-3');
    assert.leftOf('.another-tethered-thing', '#tether-target-3');
  });
});

test('tethering to an Ember Component', function(assert) {
  visit('/');

  andThen(function() {
    assert.topAligned('.component-tether', '.example-component');
    assert.rightOf('.component-tether', '.example-component');
  });
});

test('changing tether attachment', function(assert) {
  visit('/');

  andThen(function() {
    assert.topAligned('.another-tethered-thing', '#tether-target-3');
    assert.leftOf('.another-tethered-thing', '#tether-target-3');
  });

  andThen(function() {
    const anotherThing = getTetherComponent('.another-tethered-thing');
    set(anotherThing, 'attachment', 'top left');
    set(anotherThing, 'targetAttachment', 'top right');
  });

  andThen(function() {
    assert.topAligned('.another-tethered-thing', '#tether-target-3');
    assert.rightOf('.another-tethered-thing', '#tether-target-3');
  });
});

test('surviving target removal', function(assert) {
  visit('/');

  andThen(function() {
    assert.topAligned('.third-tethered-thing', '#tether-target-2 .within');
    assert.rightOf('.third-tethered-thing', '#tether-target-2 .within');
    assert.classPresent('.third-tethered-thing', 'ember-tether-enabled');
    assert.ok(Ember.$('.third-tethered-thing .highlight').text() === 'true');
  });

  click('.demo button:contains(Toggle Target)');

  andThen(function() {
    assert.classAbsent('.third-tethered-thing', 'ember-tether-enabled');
    assert.ok(Ember.$('.third-tethered-thing .highlight').text() === 'false');
  });

  click('.demo button:contains(Toggle Target)');

  andThen(function() {
    assert.topAligned('.third-tethered-thing', '#tether-target-2 .within');
    assert.rightOf('.third-tethered-thing', '#tether-target-2 .within');
    assert.classPresent('.third-tethered-thing', 'ember-tether-enabled');
    assert.ok(Ember.$('.third-tethered-thing .highlight').text() === 'true');
  });
});

test('passing in tether modules', function(assert) {
  visit('/');
  andThen(function() {
    assert.ok(window.Tether.modules.slice(-1)[0].className === TestTransitionModule.className);
  });
});
