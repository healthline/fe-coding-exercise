/* global changedTests */
import { setAddon, getStorybook, configure } from '@storybook/react';

import { setOptions } from '@storybook/addon-options';

import createPercyAddon from '@percy-io/percy-storybook';

import themeGlobals from '../lib/theme-globals';

const { percyAddon, serializeStories } = createPercyAddon();
setAddon(percyAddon);

// Stub Jest APIs
global.describe = global.test = global.it = () => {};
global.jest = {
  useFakeTimers() {},
  mock() {},
  fn() {},
};

themeGlobals();

const libRequire = require.context(
  '../lib',
  true,
  /\/__tests__\/.*\.test\.js$/,
);
const pageRequire = require.context(
  '../pages',
  true,
  /\/__tests__\/.*\.test\.js$/,
);

function filterTests(testPath) {
  return changedTests
    ? changedTests.find(changedName => testPath.includes(changedName))
    : true;
}

configure(() => {
  // Load modules from the context
  libRequire
    .keys()
    // Limit to changed tests, if defined
    .filter(filterTests)
    .forEach(libRequire);

  pageRequire
    .keys()
    // Limit to changed tests, if defined
    .filter(filterTests)
    .forEach(pageRequire);
}, module);

serializeStories(getStorybook);
setOptions({ showDownPanel: false });
