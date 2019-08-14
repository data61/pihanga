"use strict";

exports.__esModule = true;
exports.emitError = emitError;
exports.ACTION_TYPES = void 0;

var _store = require("./store");

var Domain = 'REDUX:';
var ACTION_TYPES = {
  // internal redux action
  INIT: '@@INIT',
  ERROR: Domain + "ERROR"
};
exports.ACTION_TYPES = ACTION_TYPES;

function emitError(msg, stackInfo) {
  (0, _store.dispatch)({
    type: ACTION_TYPES.ERROR,
    msg: msg,
    stackInfo: stackInfo
  });
}