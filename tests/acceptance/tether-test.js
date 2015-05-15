import Ember from 'ember';
import QUnit from 'qunit';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';

var application;
const assert = QUnit.assert;
const abs = Math.abs;
const set = Ember.set;

module('Acceptance | tether test', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
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

function getTetherComponent(selector) {
  const anotherEl = Ember.$(selector)[0];
  return Ember.View.views[anotherEl.id];
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
