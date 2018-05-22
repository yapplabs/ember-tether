import { click, visit } from '@ember/test-helpers';
import $ from 'jquery';
import { set } from '@ember/object';
import { module, test } from 'qunit';
import QUnit from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

let viewRegistry;
const { assert } = QUnit;
const { abs } = Math;

module('Acceptance | tether test', function(hooks) {
  setupApplicationTest(hooks);

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

  assert.attribute = function(thingSelector, attributeName, attributeValue) {
    let thing = $(thingSelector);
    assert.equal(thing.attr(attributeName), attributeValue, `${attributeName} has value ${attributeValue}`);
  }

  function getTetherComponent(context, selector) {
    // jscs:disable
    let anotherEl = $(selector)[0];
    // jscs:enable
    viewRegistry = context.owner.lookup('-view-registry:main');
    return viewRegistry[anotherEl.id];
  }

  test('tethering a thing to a target', async function(assert) {
    await visit('/');

    assert.topAligned('.tethered-thing', '#tether-target-1');
    assert.rightOf('.tethered-thing', '#tether-target-1');
    assert.topAligned('.another-tethered-thing', '#tether-target-3');
    assert.leftOf('.another-tethered-thing', '#tether-target-3');
  });

  test('tethering to an Ember Component', async function(assert) {
    await visit('/');

    assert.topAligned('.component-tether', '.example-component');
    assert.rightOf('.component-tether', '.example-component');
  });

  test('changing tether attachment', async function(assert) {
    await visit('/');

    assert.topAligned('.another-tethered-thing', '#tether-target-3');
    assert.leftOf('.another-tethered-thing', '#tether-target-3');
    let anotherThing = getTetherComponent(this, '.another-tethered-thing');
    set(anotherThing, 'attachment', 'top left');
    set(anotherThing, 'targetAttachment', 'top right');
    assert.topAligned('.another-tethered-thing', '#tether-target-3');
    assert.rightOf('.another-tethered-thing', '#tether-target-3');
  });

  test('surviving target removal', async function(assert) {
    await visit('/');

    assert.topAligned('.third-tethered-thing', '#tether-target-2 .within');
    assert.rightOf('.third-tethered-thing', '#tether-target-2 .within');
    assert.classPresent('.third-tethered-thing', 'ember-tether-enabled');
    assert.ok($('.third-tethered-thing .highlight').text() === 'true');

    await click('.third-tethered-thing button');

    assert.classAbsent('.third-tethered-thing', 'ember-tether-enabled');
    assert.ok($('.third-tethered-thing .highlight').text() === 'false');

    await click('.third-tethered-thing button');

    assert.topAligned('.third-tethered-thing', '#tether-target-2 .within');
    assert.rightOf('.third-tethered-thing', '#tether-target-2 .within');
    assert.classPresent('.third-tethered-thing', 'ember-tether-enabled');
    assert.ok($('.third-tethered-thing .highlight').text() === 'true');
  });

  test('binding accessibility elements', async function(assert) {
    await visit('/');

    let expectedAttributes = {
      'aria-atomic': 'true',
      'aria-busy': 'true',
      'aria-controls': 'element-id',
      'aria-current': 'current-element-id',
      'aria-describedby': 'described-element-id',
      'aria-details': 'details-element-id',
      'aria-disabled': 'true',
      'aria-errormessage': 'errormessage-element-id',
      'aria-flowto': 'flowto-elemenet-id',
      'aria-haspopup': 'grid',
      'aria-hidden': 'true',
      'aria-invalid': 'true',
      'aria-keyshortcuts': 'A',
      'aria-label': 'tether-label',
      'aria-labelledby': 'labelledby-element-id',
      'aria-live': 'polite',
      'aria-owns': 'owns-element-id',
      'aria-relevant': 'additions',
      'aria-roledescription': 'tether-role-description'
    };
    assert.attribute('.accessible-thing', 'role', 'region');
    Object.keys(expectedAttributes).forEach((attributeName) => {
      assert.attribute('.accessible-thing', attributeName, expectedAttributes[attributeName]);
    })
  });
});
