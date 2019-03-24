"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
var _exportNames = {
  ROUTER_ACTION_TYPES: true,
  navigateToPage: true,
  init: true
};
exports.init = init;
exports.navigateToPage = exports.ROUTER_ACTION_TYPES = void 0;

var _router = _interopRequireDefault(require("./router.reducers"));

var _router2 = require("./router.actions");

exports.ROUTER_ACTION_TYPES = _router2.ACTION_TYPES;
exports.navigateToPage = _router2.navigateToPage;

var _router3 = require("./router.component");

Object.keys(_router3).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  exports[key] = _router3[key];
});

var _router4 = require("./router.service");

Object.keys(_router4).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  exports[key] = _router4[key];
});

function init(registerReducer, getRoute) {
  (0, _router.default)(registerReducer, getRoute);
}