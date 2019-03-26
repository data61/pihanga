"use strict";

exports.__esModule = true;
exports.clickNavMenu = clickNavMenu;
exports.clickOpenDrawer = clickOpenDrawer;
exports.clickCloseDrawer = clickCloseDrawer;
exports.refreshContent = refreshContent;
exports.ACTION_TYPES = void 0;

var _core = require("@pihanga/core");

var Domain = 'PAGE:';
var ACTION_TYPES = {
  NAVIGATE_TO: Domain + "NAVIGATE_TO",
  REFRESH_CONTENT: Domain + "REFRESH_CONTENT",
  OPEN_DRAWER: Domain + "OPEN_DRAWER",
  CLOSE_DRAWER: Domain + "CLOSE_DRAWER",
  TOGGLE_USER_MENU: Domain + "TOGGLE_USER_MENU",
  TOGGLE_VERSION_INFO: Domain + "TOGGLE_VERSION_INFO",
  CLICK_TOP_NAV_BAR: Domain + "CLICK_TOP_NAV_BAR"
};
exports.ACTION_TYPES = ACTION_TYPES;

function clickNavMenu(component) {
  (0, _core.navigateToPage)(component.path);
}

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

function refreshContent(pageType) {
  (0, _core.dispatch)({
    type: ACTION_TYPES.REFRESH_CONTENT,
    pageType: pageType
  });
}