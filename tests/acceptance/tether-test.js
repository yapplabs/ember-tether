/* eslint-disable qunit/require-expect */
import { click, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import QUnit from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { next } from '@ember/runloop';

const { assert } = QUnit;
const { abs } = Math;

function offset(el) {
  let box = el.getBoundingClientRect();
  let docElem = document.documentElement;
  return {
    top: box.top + window.pageYOffset - docElem.clientTop,
    left: box.left + window.pageXOffset - docElem.clientLeft,
  };
}

module('Acceptance | tether test', function (hooks) {
  setupApplicationTest(hooks);

  assert.topAligned = function (thingSelector, targetSelector) {
    let thing = document.querySelector(thingSelector);
    let target = document.querySelector(targetSelector);
    let topDifference = abs(offset(thing).top - offset(target).top);
    let withinOnePixel = topDifference < 1;
    assert.ok(
      withinOnePixel,
      `${thingSelector} top within one pixel of ${targetSelector} top, difference was ${topDifference}`,
    );
  };
  assert.leftOf = function (thingSelector, targetSelector) {
    let thing = document.querySelector(thingSelector);
    let target = document.querySelector(targetSelector);
    let leftOf = offset(thing).left < offset(target).left;
    assert.ok(leftOf, `${thingSelector} left of ${targetSelector}`);
  };
  assert.rightOf = function (thingSelector, targetSelector) {
    let thing = document.querySelector(thingSelector);
    let target = document.querySelector(targetSelector);
    let leftOf = offset(thing).left > offset(target).left;
    assert.ok(leftOf, `${thingSelector} right of ${targetSelector}`);
  };
  assert.classPresent = function (thingSelector, className) {
    let thing = document.querySelector(thingSelector);
    assert.ok(thing.classList.contains(className));
  };
  assert.classAbsent = function (thingSelector, className) {
    let thing = document.querySelector(thingSelector);
    assert.ok(!thing.classList.contains(className));
  };

  assert.attribute = function (thingSelector, attributeName, attributeValue) {
    let thing = document.querySelector(thingSelector);
    assert.equal(
      thing.getAttribute(attributeName),
      attributeValue,
      `${attributeName} has value ${attributeValue}`,
    );
  };

  test('tethering a thing to a target', async function (assert) {
    await visit('/');

    assert.topAligned('.tethered-thing', '#tether-target-1');
    assert.rightOf('.tethered-thing', '#tether-target-1');
    assert.topAligned('.another-tethered-thing', '#tether-target-3');
    assert.leftOf('.another-tethered-thing', '#tether-target-3');
  });

  test('tethering to an Ember Component', async function (assert) {
    await visit('/');

    assert.topAligned('.component-tether', '.example-component');
    assert.rightOf('.component-tether', '.example-component');
  });

  test('changing tether attachment', async function (assert) {
    assert.expect(4);
    await visit('/');

    assert.topAligned('.another-tethered-thing', '#tether-target-3');
    assert.leftOf('.another-tethered-thing', '#tether-target-3');
    let applicationController = this.owner.lookup('controller:application');
    applicationController.exampleAttachment = 'top left';
    applicationController.exampleTargetAttachment = 'top right';
    next(() => {
      assert.topAligned('.another-tethered-thing', '#tether-target-3');
      assert.rightOf('.another-tethered-thing', '#tether-target-3');
    });
  });

  test('surviving target removal', async function (assert) {
    await visit('/');

    assert.topAligned('.third-tethered-thing', '#tether-target-2 .within');
    assert.rightOf('.third-tethered-thing', '#tether-target-2 .within');
    assert.classPresent('.third-tethered-thing', 'ember-tether-enabled');
    assert.strictEqual(
      document.querySelector('.third-tethered-thing .highlight').textContent,
      'true',
    );

    await click('.third-tethered-thing button');

    assert.classAbsent('.third-tethered-thing', 'ember-tether-enabled');
    assert.strictEqual(
      document.querySelector('.third-tethered-thing .highlight').textContent,
      'false',
    );

    await click('.third-tethered-thing button');

    assert.topAligned('.third-tethered-thing', '#tether-target-2 .within');
    assert.rightOf('.third-tethered-thing', '#tether-target-2 .within');
    assert.classPresent('.third-tethered-thing', 'ember-tether-enabled');
    assert.strictEqual(
      document.querySelector('.third-tethered-thing .highlight').textContent,
      'true',
    );
  });

  test('binding accessibility elements', async function (assert) {
    await visit('/');

    let expectedAttributes = {
      'aria-atomic': 'true',
      'aria-busy': 'true',
      'aria-controls': 'element-id',
      'aria-current': 'page',
      'aria-describedby': 'described-element-id',
      'aria-details': 'details-element-id',
      'aria-flowto': 'flowto-elemenet-id',
      'aria-hidden': 'true',
      'aria-keyshortcuts': 'A',
      'aria-label': 'tether-label',
      'aria-labelledby': 'labelledby-element-id',
      'aria-live': 'polite',
      'aria-owns': 'owns-element-id',
      'aria-relevant': 'additions',
      'aria-roledescription': 'tether-role-description',
    };
    assert.attribute('.accessible-thing', 'role', 'region');
    Object.keys(expectedAttributes).forEach((attributeName) => {
      assert.attribute(
        '.accessible-thing',
        attributeName,
        expectedAttributes[attributeName],
      );
    });
  });
});
