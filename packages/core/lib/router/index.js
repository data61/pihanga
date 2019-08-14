"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.init = init;
exports.browserHistory = exports.navigateToPage = exports.ROUTER_ACTION_TYPES = void 0;

var _history = require("history");

var _router = _interopRequireDefault(require("./router.reducers"));

var _router2 = require("./router.actions");

exports.ROUTER_ACTION_TYPES = _router2.ACTION_TYPES;
exports.navigateToPage = _router2.navigateToPage;
var browserHistory = (0, _history.createBrowserHistory)();
exports.browserHistory = browserHistory;

function init(registerReducer, opts) {
  (0, _router.default)(registerReducer, browserHistory, opts);
}