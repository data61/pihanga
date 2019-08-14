"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _immutabilityHelper = _interopRequireDefault(require("immutability-helper"));

var _page = require("./page.actions");

//import {  ROUTER_ACTION_TYPES } from '@pihanga/core';
var _default = function _default(registerReducer) {
  // registerReducer(ROUTER_ACTION_TYPES.SHOW_PAGE, (state, action) => {
  //   const bc = state.route.breadcrumbs
  //   .slice(0, state.route.breadcrumbs.length - 1)
  //   .filter(b => b.showInBreadcrumb)
  //   .map(e => ({
  //     title: e.title,
  //     path: e.routePath,
  //   }));
  //   //const last = bc.pop();
  //   return update(ensurePage(state), {
  //     page: { 
  //       subTitle: { $set: state.route.title },
  //       breadcrumbs: { $set: bc } 
  //     }
  //   });
  // });
  registerReducer(_page.ACTION_TYPES.OPEN_DRAWER, function (state, action) {
    return drawerState(state, true);
  });
  registerReducer(_page.ACTION_TYPES.CLOSE_DRAWER, function (state, action) {
    return drawerState(state, false, action.cardName);
  });

  function drawerState(state, isOpen, cardName) {
    return (0, _immutabilityHelper.default)(ensurePage(state), {
      page: {
        drawerOpen: {
          $set: isOpen
        }
      }
    });
  }

  function ensurePage(state) {
    if (state.page) return state;
    return (0, _immutabilityHelper.default)(state, {
      page: {
        $set: {}
      }
    });
  }

  registerReducer(_page.ACTION_TYPES.TOGGLE_USER_MENU, function (state, action) {
    return (0, _immutabilityHelper.default)(ensurePage(state), {
      page: {
        userMenu: {
          $set: {
            isOpen: action.isOpen
          }
        }
      }
    });
  });
  registerReducer(_page.ACTION_TYPES.TOGGLE_VERSION_INFO, function (state, action) {
    return (0, _immutabilityHelper.default)(ensurePage(state), {
      scratch: {
        versionInfo: {
          $set: {
            isOpen: action.isOpen,
            anchorEl: action.anchorEl
          }
        }
      }
    });
  });
};

exports.default = _default;