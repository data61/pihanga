const utils = require('./shared/utils');
const execSync = require('child_process').execSync;
const environmentConfig = require('./shared/environment-config');
const nodePath = require('./shared/node-path');

// Set environment
const environmentName = utils.getArgValueByName(process.argv)[environmentConfig.envArgumentName];
environmentConfig.setEnvironment(environmentName);

console.log(`-- Running the app on localhost - ${nodePath}`);
execSync(`${nodePath} react-scripts start`, { stdio: 'inherit' });
