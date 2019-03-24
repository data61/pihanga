"use strict";

exports.__esModule = true;
exports.throwUnauthorisedError = throwUnauthorisedError;
exports.throwPermissionDeniedError = throwPermissionDeniedError;
exports.ACTION_TYPES = void 0;

var _redux = require("../redux");

var Domain = 'BACKEND:';
var ACTION_TYPES = {
  THROW_UNAUTHORISED_ERROR: Domain + "THROW_UNAUTHORISED_ERROR",
  THROW_PERMISSION_DENIED_ERROR: Domain + "THROW_PERMISSION_DENIED_ERROR"
};
exports.ACTION_TYPES = ACTION_TYPES;

function throwUnauthorisedError() {
  (0, _redux.dispatch)({
    type: ACTION_TYPES.THROW_UNAUTHORISED_ERROR
  });
}

function throwPermissionDeniedError() {
  (0, _redux.dispatch)({
    type: ACTION_TYPES.THROW_PERMISSION_DENIED_ERROR
  });
}