import Ember from 'ember';
import set from 'ember-metal/set';
import QUnit from 'qunit';
import { test } from 'qunit';
import moduleForAcceptance from 'dummy/tests/helpers/module-for-acceptance';

let viewRegistry;
const { assert } = QUnit;
const { abs } = Math;
const { $ } = Ember;

moduleForAcceptance('Acceptance | tether test', {
  beforeEach() {
    viewRegistry = this.application.__container__.lookup('-view-registry:main');
  }
});

assert.topAligned = function(thingSelector, targetSelector) {
  let thing = $(thingSelector);
  let target = $(targetSelector);
  let topDifference = abs(thing.offset().top - target.offset().top);
  let withinOnePixel = topDifference < 1;
  assert.ok(withinOnePixel, `${thingSelector} top within one pixel of ${targetSelector} top, difference was ${topDifference}`);
};
assert.leftOf = function(thingSelector, targetSelector) {
  let thing = $(thingSelector);
  let target = $(targetSelector);
  let leftOf = thing.offset().left < target.offset().left;
  assert.ok(leftOf, `${thingSelector} left of ${targetSelector}`);
};
assert.rightOf = function(thingSelector, targetSelector) {
  let thing = $(thingSelector);
  let target = $(targetSelector);
  let leftOf = thing.offset().left > target.offset().left;
  assert.ok(leftOf, `${thingSelector} right of ${targetSelector}`);
};
assert.classPresent = function(thingSelector, className) {
  let thing = $(thingSelector);
  assert.ok(thing.attr('class').indexOf(className) > -1);
};
assert.classAbsent = function(thingSelector, className) {
  let thing = $(thingSelector);
  assert.ok(thing.attr('class').indexOf(className) <= -1);
};

function getTetherComponent(selector) {
  // jscs:disable
  let anotherEl = $(selector)[0];
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
    let anotherThing = getTetherComponent('.another-tethered-thing');
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
    assert.ok($('.third-tethered-thing .highlight').text() === 'true');
  });

  click('.demo button:contains(Toggle Target)');

  andThen(function() {
    assert.classAbsent('.third-tethered-thing', 'ember-tether-enabled');
    assert.ok($('.third-tethered-thing .highlight').text() === 'false');
  });

  click('.demo button:contains(Toggle Target)');

  andThen(function() {
    assert.topAligned('.third-tethered-thing', '#tether-target-2 .within');
    assert.rightOf('.third-tethered-thing', '#tether-target-2 .within');
    assert.classPresent('.third-tethered-thing', 'ember-tether-enabled');
    assert.ok($('.third-tethered-thing .highlight').text() === 'true');
  });
});
