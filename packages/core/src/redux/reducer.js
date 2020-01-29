import isPlainObject from 'lodash.isplainobject';
import stackinfo from 'stackinfo';

import { createLogger } from '../logger/logger';
import { ACTION_TYPES, emitError } from './redux.actions';

const logger = createLogger('reducer');

function dispatchError(msg, e) {
  const si = stackinfo(e).map(s => s.traceline);
  const si2 = e ? si : si.slice(1); // remove this function when no exception stacktrace
  logger.error(msg, si2);
  setTimeout(() => {
    emitError(msg, si2);
  }, 10);
}

function getType(action) {
  // fix redux's internalActionTypes as we can't access them directly
  const t = action.type;
  return t === '@@redux/INIT' ? ACTION_TYPES.INIT : t;
}

export class Reducer {
  constructor(reducerByAction) {
    this.reducerByAction = reducerByAction;
  }

  registerReducer(type, reducer) {
    if (!type) {
      throw new Error('Missing type');
    }
    let d = this.reducerByAction[type];
    if (d === undefined) {
      this.reducerByAction[type] = [];
      d = this.reducerByAction[type];
    }
    d.push(reducer);

    logger.infoSilently(`Register reducer for type: ${type}`);
  }

  rootReducer(state, action) {
    const type = getType(action);
    const tr = this.reducerByAction[type];
    if (tr) {
      return tr.reduce((s, reducer) => {
        try {
          const s2 = reducer(s, action);
          if (!isPlainObject(s2)) {
            dispatchError(`Reducer '${reducer}' returns unexpected value '${s2}'`);
            return s; // ignore 'reducer'
          }
          return s2;
        } catch (e) {
          dispatchError(`While executing ${reducer} - ${e}`, e);
          return s; // ignore 'reducer'
        }
      }, state);
    }
    if (type !== ACTION_TYPES.INIT) {
      logger.debugSilently(`No reducer registered for type: ${type}, action:`, action);
    }
    return state;
  }
}
