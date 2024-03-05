# Ember Tether [![Build Status](https://travis-ci.org/yapplabs/ember-tether.svg?branch=master)](https://travis-ci.org/yapplabs/ember-tether) [![Ember Observer Score](http://emberobserver.com/badges/ember-tether.svg)](http://emberobserver.com/addons/ember-tether)

This ember-cli addon provides a component that allows for 'tethering' a block to a target somewhere else on the page. The target may be an element, an element selector, or an Ember view. Importantly, the component retains typical context for Ember action handling and data binding.


## Compatibility

* Ember.js v3.28 or above
* Ember CLI v3.28 or above
* Node.js v14 or above

For Ember 1.13 - 2.3, use 0.4.1. For support for earlier versions of Ember, use ember-tether 0.3.1.

## Installation

## Live Demo

View a live demo here: [http://yapplabs.github.io/ember-tether/](http://yapplabs.github.io/ember-tether/)

## Installation

`ember install ember-tether`

*Note:* Ember CLI versions < 0.2.3 should use `ember install:addon` instead of `ember install`

## Example Usage

Given the following DOM:

```html
<body class="ember-application">
  <div id="a-nice-person">
    Nice person
  </div>
  <div class="ember-view">
    <!-- rest of your Ember app's DOM... -->
  </div>
</body>
```

and a template like this:

```hbs
<EmberTether
  @target='#a-nice-person'
  @targetAttachment='top right'
  @attachment='top left'
>
  A puppy
</EmberTether>
```

Then "A puppy" would be rendered alongside the `a-nice-person` div.

If the ember-tether component is destroyed, its far-off content is destroyed too.
For example, given:

```hbs
{{#if this.isShowing}}
  <EmberTether
    @target='#a-nice-person'
    @targetAttachment='top right'
    @attachment='top left'
  >
    A puppy
  </EmberTether>
{{/if}}
```

If `this.isShowing` starts off true and becomes false, then the "A puppy" text will be removed from the page.

Similarly, if you use `<EmberTether />` in a route's template, it will
render its content next to the target element when the route is entered
and remove it when the route is exited.

## Acceptance Testing

Tether works by appending tethered elements to the `<body>` tag. Unfortunately, this moves your content outside of the Ember application `rootElement` during acceptance testing. This breaks event dispatch and action handling, including traditional Ember test helpers like `click`.

As of version 0.4.0, we can configure a different element to be used instead of body. This can be useful for Ember tests.

```js
// config/environment.js

ENV['ember-tether'] = {
  bodyElementId: 'ember-testing'
};
```

It is also possible to pass a `bodyElement` to a particular ember-tether component declaration.

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.


## License

- [Ship Shape Tether](https://github.com/shipshapecode/tether), the underlying library that implement the actual tethering behavior
- [ember-wormhole](https://github.com/yapplabs/ember-wormhole), whose pattern for element content manipulation inspired the approach in ember-tether
- [Tetherball](http://en.wikipedia.org/wiki/Tetherball), for providing countless hours of entertainment over the past century
