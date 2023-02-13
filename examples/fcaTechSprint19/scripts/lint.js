const utils = require('./shared/utils');
const execSync = require('child_process').execSync;
const environmentConfig = require('./shared/environment-config');
const nodePath = require('./shared/node-path');

// Set environment
const environmentName = utils.getArgValueByName(process.argv)[environmentConfig.envArgumentName];
environmentConfig.setEnvironment(environmentName);

console.log('-- Checking "src/" against eslint rules from ".eslintrc"');
execSync(`${nodePath} eslint --ext .jsx,.js src/`, { stdio: 'inherit' });
console.log('No errors.');
