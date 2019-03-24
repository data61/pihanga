"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.Reducer = void 0;

var _isPlainObject = _interopRequireDefault(require("lodash/isPlainObject"));

var _stackinfo = _interopRequireDefault(require("stackinfo"));

var _logger = require("../logger/logger");

var _redux = require("./redux.actions");

var logger = (0, _logger.createLogger)('reducer');

function dispatchError(msg, e) {
  var si = (0, _stackinfo.default)(e).map(function (s) {
    return s.traceline;
  });
  var si2 = e ? si : si.slice(1); // remove this function when no exception stacktrace

  logger.error(msg, si2);
  setTimeout(function () {
    (0, _redux.emitError)(msg, si2);
  }, 10);
}

function getType(action) {
  // fix redux's internalActionTypes as we can't access them directly
  var t = action.type;
  return t === '@@redux/INIT' ? _redux.ACTION_TYPES.INIT : t;
}

var Reducer =
/*#__PURE__*/
function () {
  function Reducer(reducerByAction) {
    this.reducerByAction = reducerByAction;
  }

  var _proto = Reducer.prototype;

  _proto.registerReducer = function registerReducer(type, reducer) {
    if (!type) {
      throw new Error('Missing type');
    }

    var d = this.reducerByAction[type];

    if (d === undefined) {
      this.reducerByAction[type] = [];
      d = this.reducerByAction[type];
    }

    d.push(reducer);
    logger.infoSilently("Register reducer for type: " + type);
  };

  _proto.rootReducer = function rootReducer(state, action) {
    var type = getType(action);
    var tr = this.reducerByAction[type];

    if (tr) {
      return tr.reduce(function (s, reducer) {
        try {
          var s2 = reducer(s, action);

          if (!(0, _isPlainObject.default)(s2)) {
            dispatchError("Reducer '" + reducer + "' returns unexpected value '" + s2 + "'");
            return s; // ignore 'reducer'
          }

          return s2;
        } catch (e) {
          dispatchError("While executing " + reducer + " - " + e, e);
          return s; // ignore 'reducer'
        }
      }, state);
    }

    if (type !== _redux.ACTION_TYPES.INIT) {
      logger.debugSilently("No reducer registered for type: " + type + ", action:", action);
    }

    return state;
  };

  return Reducer;
}();

exports.Reducer = Reducer;