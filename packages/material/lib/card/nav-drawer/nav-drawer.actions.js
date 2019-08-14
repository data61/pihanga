"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.clickOpenDrawer = clickOpenDrawer;
exports.clickCloseDrawer = clickCloseDrawer;
exports.clickNavMenu = clickNavMenu;
exports.ACTION_TYPES = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _core = require("@pihanga/core");

var Domain = 'NAV_DRAWER:';
var ACTION_TYPES = {
  OPEN_DRAWER: Domain + "OPEN_DRAWER",
  CLOSE_DRAWER: Domain + "CLOSE_DRAWER",
  NAV_REQUEST: Domain + "NAV_REQUEST"
};
exports.ACTION_TYPES = ACTION_TYPES;

function clickOpenDrawer(cardName) {
  (0, _core.dispatch)({
    type: ACTION_TYPES.OPEN_DRAWER,
    cardName: cardName
  });
}

function clickCloseDrawer(cardName) {
  (0, _core.dispatch)({
    type: ACTION_TYPES.CLOSE_DRAWER,
    cardName: cardName
  });
}

function clickNavMenu(component, cardName) {
  (0, _core.dispatch)((0, _extends2.default)({
    type: ACTION_TYPES.NAV_REQUEST,
    cardName: cardName
  }, component));
}