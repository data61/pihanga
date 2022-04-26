import isPlainObject from 'lodash.isplainobject';
import stackinfo from 'stackinfo';

import { createLogger } from '../logger/logger';
import { ACTION_TYPES, emitError } from './redux.actions';
import { action as toAction } from './actions';

const logger = createLogger('@pihanga:core:reducer');

const DEF_PRIORITY = 500;

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
    this._reducerByAction = reducerByAction;
    this._reducerAllStart = undefined;
    this._reducerAllEnd = undefined;
  }

  registerReducer(...args) {
    const [type, reducer, priority] = Reducer.parseReducerArgs(args);
    if (!type) {
      throw new Error('Missing type');
    }
    if (typeof reducer !== 'function') {
      throw new Error('Expected the reducer to be a function.');
    }
    let d = this._reducerByAction[type];
    if (d === undefined) {
      this._reducerByAction[type] = [];
      d = this._reducerByAction[type];
    }
    d.push({ reducer, priority });
    d.sort((a, b) => b.priority - a.priority);

    logger.infoSilently(`Register reducer for type: ${type} with priority ${priority}`);
  }

  reducerAllStart(reducer) {
    if (typeof reducer !== 'function') {
      throw new Error('Expected the reducer to be a function.');
    }
    const r = { reducer, priority: -1 };
    if (this._reducerAllStart === undefined) {
      this._reducerAllStart = [r];
    } else {
      this._reducerAllStart.push(r);
    }
    logger.infoSilently('Register ALL_START reducer');
  }

  reducerAllEnd(reducer) {
    if (typeof reducer !== 'function') {
      throw new Error('Expected the reducer to be a function.');
    }
    const r = { reducer, priority: -1 };
    if (this._reducerAllEnd === undefined) {
      this._reducerAllEnd = [r];
    } else {
      this._reducerAllEnd.push(r);
    }
    logger.infoSilently('Register ALL_END reducer');
  }

  static parseReducerArgs(args) {
    switch (args.length) {
      case 2: {
        return [...args, DEF_PRIORITY];
      }
      case 3: {
        if (typeof args[1] === 'function') {
          return args;
        } else {
          return [toAction(args[0], args[1]), args[2], DEF_PRIORITY];
        }
      }
      case 4: {
        if (typeof args[2] === 'function') {
          return args;
        } else {
          throw new Error('Illegal type of argument, expected function as 3rd argument');
        }
      }
      default:
        throw new Error('Illegal number of arguments, expected 2, 3 or 4');
    }
  }

  rootReducer(state, action) {
    const type = getType(action);
    let tr = this._reducerByAction[type] || [];
    if (this._reducerAllStart) {
      tr = this._reducerAllStart.concat(tr);
    }
    if (this._reducerAllEnd) {
      tr = tr.concat(this._reducerAllEnd);
    }
    if (tr.length > 0) {
      return tr.reduce((s, { reducer }) => {
        try {
          const s2 = reducer(s, action);
          if (!isPlainObject(s2)) {
            dispatchError(`Reducer '${reducer}' for action '${action}' returns unexpected value '${s2}'`);
            return s; // ignore 'reducer'
          }
          return s2;
        } catch (e) {
          dispatchError(`While executing action '${action}' with reducer '${reducer}' - ${e}`, e);
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
