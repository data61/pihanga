/**
 * This takes a list of arguments in and return a map of argument value by name
 *
 * Example:
 * Given:
 *  ['/usr/local/bin/node', '/tools/set-environment.js', '--env=dev', '--something-else=anyValue']
 *
 * Return:
 *  {
 *    'env': 'dev',
 *    'something-else': 'anyValue',
 *  }
 *
 * @param {array} args - Array of arguments
 */
function getArgValueByName(args) {
  // Ignore the first two arguments, which are not useful
  const filteredArgs = args.slice(2);

  const argValueByName = {};
  filteredArgs.forEach((arg) => {
    if (arg.startsWith('--')) {
      const argNameAndValue = arg.substring(2).split('=');
      argValueByName[argNameAndValue[0]] = argNameAndValue[1];
    }
  });

  return argValueByName;
}

module.exports.getArgValueByName = getArgValueByName;
