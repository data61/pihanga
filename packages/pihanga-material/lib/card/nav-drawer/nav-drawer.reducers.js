"use strict";

exports.__esModule = true;
exports.default = void 0;

var _core = require("@pihanga/core");

var _navDrawer = require("./nav-drawer.actions");

var _default = function _default(registerReducer) {
  registerReducer(_navDrawer.ACTION_TYPES.OPEN_DRAWER, function (state, action) {
    return drawerState(true, state, action);
  });
  registerReducer(_navDrawer.ACTION_TYPES.CLOSE_DRAWER, function (state, action) {
    return drawerState(false, state, action);
  });

  function drawerState(drawerIsOpen, state, action) {
    return (0, _core.update)(state, ['pihanga', action.id], {
      drawerIsOpen: drawerIsOpen
    });
  }
};

exports.default = _default;