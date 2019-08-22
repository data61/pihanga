const utils = require('./shared/utils');
const execSync = require('child_process').execSync;
const environmentConfig = require('./shared/environment-config');
const nodePath = require('./shared/node-path');

const argValueByName = utils.getArgValueByName(process.argv);

// Set environment
environmentConfig.setEnvironment(argValueByName[environmentConfig.envArgumentName]);

console.log('-- Running tests');

// Set coverage threshold if given
const coverageThreshold = argValueByName['coverage-threshold'];

/**
 * Run all tests
 * @param extraArgument
 */
function runTests(extraArgument) {
  execSync(`${nodePath} react-scripts test --env=jsdom ${extraArgument}`, { stdio: 'inherit' });
}

if (coverageThreshold) {
  runTests('--coverage');

  console.log('-- Checking test coverage');
  /**
   * NOTE: react-scripts uses Jest, which does have its own coverage checker.
   * However currently there is no way to specify that without ejecting react-scripts.
   * (See issue: https://github.com/facebookincubator/create-react-app/issues/922)
   *
   * Since there isn't a strong need for ejecting react-script yet, "istanbul" is
   * used just for checking the coverage and fail the build
   *
   * The drawback is Istanbul is a complete separate package, that also has its own coverage
   * generator. Ideally, we should use Jest to do this.
   */
  execSync('istanbul check-coverage' +
    ` --statements ${coverageThreshold}` +
    ` --functions ${coverageThreshold}` +
    ` --branches ${coverageThreshold}` +
    ` --lines ${coverageThreshold}`);

  console.log(`Coverage does meet the global threshold (${coverageThreshold}%).`);
} else {
  runTests();
}
