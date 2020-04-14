import { createLogger } from '../logger';

const logger = createLogger('card.service');
const ns2Actions = [];

/**
 * Register a set of actions for a particular namespace.
 * 
 * The 'actions' paramer can either be a hash from a local name 
 * to a globally unique name. Or can be an array of local action
 * names which will be converted into a hash where the local name
 * is the key and the value is of the pattern 'namespace:name'.
 * 
 * The function returns the hash registered under this namespace.
 * 
 * @param {string} namespace 
 * @param {hash||array} actions 
 */
export function registerActions(namespace, actionsAL) {
  if (ns2Actions[namespace]) {
    logger.warn(`Overwriting action namespace  "${namespace}"`);
  }
  let ah;
  if (Array.isArray(actionsAL)) {
    ah = {};
    actionsAL.forEach((a) => {
      ah[a] = `${namespace}:${a}`;
    });
  } else {
    ah = actionsAL;
  }
  logger.info(`Register action namespace "${namespace}"`);
  ns2Actions[namespace] = ah;
  return ah;
}

/**
 * Return the actions registered for a particular component/namespace.
 * 
 * If nothing was registered for this namespace, an empty hash is returned.
 * 
 * @param {string} namespace 
 */
export function actions(...args) {
  const [namespace, name] = args;
  if (namespace && name) {
    return action(namespace, name);
  }

  if (!namespace) {
    throw Error('Missing namespace argument');
  }
  const as = ns2Actions[namespace];
  if (as) {
    logger.warn(`Upgrade 'action(${namespace})' to 'action(${namespace}, name)'`);
    return as;
  } else {
    logger.warn(`Requesting actions from unknown namespace '${namespace}'`);
    return {};
  }
}

export function action(namespace, name) {
  if (!namespace || !name) {
    throw Error('Missing namespace or name argument');
  }
  const as = ns2Actions[namespace];
  if (as) {
    const fullName = as[name];
    if (!name) {
      throw Error(`Requesting unknown action '${name}' from namespace '${namespace}'`);
    }
    return fullName;
  } else {
    throw Error(`Requesting action '${name}' from unknown namespace '${namespace}'`);
  }
}
