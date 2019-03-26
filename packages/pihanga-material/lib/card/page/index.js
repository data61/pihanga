"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
var _exportNames = {
  ACTION_TYPES: true,
  init: true
};
exports.init = init;
exports.ACTION_TYPES = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _page = require("./page.actions");

var _page2 = _interopRequireDefault(require("./page.reducers"));

var _page3 = require("./page.component");

Object.keys(_page3).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  exports[key] = _page3[key];
});
//import { ACTION_TYPES as USER_MENU_ACTION_TYPES } from './user-menu';
var ACTION_TYPES = (0, _extends2.default)({}, _page.ACTION_TYPES);
exports.ACTION_TYPES = ACTION_TYPES;

function init(register) {
  (0, _page2.default)(register.reducer);
  register.cardComponent({
    name: 'Page',
    component: _page3.PageComponent,
    events: {
      onNavMenuClicked: _page.ACTION_TYPES.NAVIGATE_TO,
      onRefreshContent: _page.ACTION_TYPES.REFRESH_CONTENT,
      onOpenDrawer: _page.ACTION_TYPES.OPEN_DRAWER
    }
  });
}