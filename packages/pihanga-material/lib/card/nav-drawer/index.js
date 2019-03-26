"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
var _exportNames = {
  init: true
};
exports.init = init;

var _navDrawer = _interopRequireDefault(require("./nav-drawer.reducers"));

var _navDrawer2 = require("./nav-drawer.component");

var _navDrawer3 = require("./nav-drawer.actions");

Object.keys(_navDrawer3).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  exports[key] = _navDrawer3[key];
});

//import { ACTION_TYPES as PAGE_ACTION_TYPES } from './page.actions';
//import { ACTION_TYPES as USER_MENU_ACTION_TYPES } from './user-menu';
function init(register) {
  (0, _navDrawer.default)(register.reducer);
  register.cardComponent({
    name: 'NavDrawer',
    component: _navDrawer2.NavDrawerCard,
    events: {
      onOpenDrawer: _navDrawer3.ACTION_TYPES.OPEN_DRAWER,
      onCloseDrawer: _navDrawer3.ACTION_TYPES.CLOSE_DRAWER,
      onClickNavMenu: _navDrawer3.ACTION_TYPES.NAV_REQUEST
    }
  });
}