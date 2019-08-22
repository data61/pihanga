'use strict';

const shell = require('shelljs');

const defaultEnvironmentName = 'dev';
const envArgumentName = 'env';

function setEnvironment(environmentName) {
  console.log('-- Creating "environment.js" from "environment.{env}.js" in "src/environments/"');

  let env = environmentName;
  if (!env) {
    env = defaultEnvironmentName;
    console.log('Environment name is not specified. A default environment is used instead.');
    console.log(`List of arguments: ${process.argv}`);
    console.log(`If this is not expected. Please specify one with "--${envArgumentName}=something or "--` +
      ` --${envArgumentName}=something" (if you run this with "npm run").`);
  }

  const environmentsDir = 'src/environments';
  try {
    shell.cp(
      `${environmentsDir}/environment.${env}.js`,
      `${environmentsDir}/environment.js`);
    console.log(`"environment.js" is set to "environment.${env}.js".`);
  } catch (err) {
    console.error(err);
  }

  // insert new line
  console.log();
}

module.exports.setEnvironment = setEnvironment;
module.exports.envArgumentName = envArgumentName;
