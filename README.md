# Ember Tether [![Build Status](https://travis-ci.org/yapplabs/ember-tether.svg?branch=master)](https://travis-ci.org/yapplabs/ember-tether) [![Ember Observer Score](http://emberobserver.com/badges/ember-tether.svg)](http://emberobserver.com/addons/ember-tether)

This ember-cli addon provides a component that allows for 'tethering' a block to a target somewhere else on the page. The target may be an element, an element selector, or an Ember view. Importantly, the component retains typical context for Ember action handling and data binding.

## Live Demo

View a live demo here: [http://yapplabs.github.io/ember-tether/](http://yapplabs.github.io/ember-tether/)

## Installation

`ember install ember-tether`

*Note:* Ember CLI versions < 0.2.3 should use `ember install:addon` instead of `ember install`

## Example Usage

Given the following DOM:

```html
<body class="ember-application">
  <!-- Target must be in the same element as your ember app -->
  <!-- otherwise events/bindings on the tethered content will not work -->
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
{{#ember-tether
    target='#a-nice-person'
    targetAttachment='top right'
    attachment='top left'
}}
  A puppy
{{/ember-tether}}
```

Then "A puppy" would be rendered alongside the `a-nice-person` div.

If the ember-tether component is destroyed, its far-off content is destroyed too.
For example, given:

```hbs
{{#if isShowing}}
  {{#ember-tether
      target='#a-nice-person'
      targetAttachment='top right'
      attachment='top left'
  }}
    A puppy
  {{/ember-tether}}
{{/if}}
```

If `isShowing` starts off true and becomes false, then the "A puppy" text will be removed from the page.

Similarly, if you use `ember-tether` in a route's template, it will
render its content next to the target element when the route is entered
and remove it when the route is exited.

## Acceptance Testing

Hubspot Tether works by appending tethered elements to the `<body>` tag. Unfortunately, this moves your
content outside of the Ember application `rootElement` during acceptance testing. This breaks event
dispatch and action handling, including traditional Ember test helpers like `click`.

In order to [short-circuit Hubspot's positioning behavior](https://github.com/HubSpot/tether/pull/98/), we must use static positioning on the
`#ember-testing-container` div as follows:

##### tests/index.html
```html
<style>
  #ember-testing-container {
    /* Set position static to short-circuit Hubspot Tether's positioning */
    /* https://github.com/HubSpot/tether/pull/98/ */
    position: static !important;
  }
</style>
```

## Using ember-tether in Your Own Addon

ember-tether depends on [Hubspot Tether](http://github.hubspot.com/tether/), which is imported as a globals-style JS dependency. When using ember-tether directly in an Ember app, everything will work out of the box with no configuration necessary.

However, addons nested in other addons do not have access to `app.import` in their included hook and are therefore unable to import their own dependencies. This is not a problem unique to ember-tether.

The solution to this is to declare ember-tether as a `peerDependency` to ensure that it gets installed alongside your addon as a dependency of the root application. You'll likely also want it as a `devDependency` so that it's available during development and testing.

## Development Setup

### Installation

* `git clone` this repository
* `npm install`
* `bower install`

### Running Tests

* `ember try:testall`
* `ember test`
* `ember test --server`

### Running the dummy app

* `ember server`
* Visit your app at http://localhost:4200.

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).

## Generating the Changelog

This project uses [https://github.com/skywinder/github-changelog-generator](https://github.com/skywinder/github-changelog-generator) to generate its changelog.

## Credits

- [Hubspot Tether](http://github.hubspot.com/tether/), the underlying library that implement the actual tethering behavior
- [ember-wormhole](https://github.com/yapplabs/ember-wormhole), whose pattern for element content manipulation inspired the approach in ember-tether
- [Tetherball](http://en.wikipedia.org/wiki/Tetherball), for providing countless hours of entertainment over the past century
