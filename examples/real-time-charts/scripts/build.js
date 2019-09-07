const utils = require('./shared/utils');
const execSync = require('child_process').execSync;
const environmentConfig = require('./shared/environment-config');
const nodePath = require('./shared/node-path');

// Set environment
const environmentName = utils.getArgValueByName(process.argv)[environmentConfig.envArgumentName];
environmentConfig.setEnvironment(environmentName);

console.log('-- Bundling the app');
execSync(`${nodePath} react-scripts build`, { stdio: 'inherit' });
console.log('Build succeeds.');
