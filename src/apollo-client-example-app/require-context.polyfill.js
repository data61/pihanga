/**
 * This function is similar to webpack's require.context() which is not available when running
 * tests.
 *
 * It is used to load all "index.js" dynamically and execute their "init()" functions.
 *
 * @param base
 * @param scanSubDirectories
 * @param regularExpression
 * @returns {Module}
 */
export function requireContext(base = '.', scanSubDirectories = false, regularExpression) {
  // eslint-disable-next-line global-require
  const fs = require('fs');

  // eslint-disable-next-line global-require
  const path = require('path');

  const files = {};

  function readDirectory(directory) {
    fs.readdirSync(directory).forEach((file) => {
      const fullPath = path.resolve(directory, file);

      if (fs.statSync(fullPath).isDirectory()) {
        if (scanSubDirectories) readDirectory(fullPath);

        return;
      }

      const pathToCheck = fullPath.replace(__dirname, '.');
      if (!regularExpression.test(pathToCheck)) return;

      files[pathToCheck] = true;
    });
  }

  readDirectory(path.resolve(__dirname, base));

  function Module(file) {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    return require(file);
  }

  Module.keys = () => Object.keys(files);

  return Module;
}
