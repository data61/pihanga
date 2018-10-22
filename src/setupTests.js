// This file belongs to testing, and it should only be required in dev dependencies
// eslint-disable-next-line import/no-extraneous-dependencies
import jasmineCheck from 'jasmine-check';

/**
 * Place all global mock or setup for unit testing here.
 *
 * 'react-script' will load this file before any other '*.spec.js'
 */

jasmineCheck.install();

/**
 * Cookies mock
 */
(() => {
  let cookieEnabled = true;

  Object.defineProperty(document, 'cookie', (() => {
    let value = '';
    return {
      get: () => (cookieEnabled ? value : undefined),
      set: (newValue) => {
        if (cookieEnabled) {
          value = newValue;
        }
      },
    };
  })());

  document.enableCookie = (enabled) => {
    cookieEnabled = enabled;
  };
})();
