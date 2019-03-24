"use strict";

exports.__esModule = true;
exports.navigateToPage = navigateToPage;
exports.ACTION_TYPES = void 0;

var _redux = require("../redux");

var Domain = 'ROUTER:';
var ACTION_TYPES = {
  SHOW_PAGE: Domain + "SHOW_PAGE",
  NAVIGATE_TO_PAGE: Domain + "NAVIGATE_TO_PAGE"
};
exports.ACTION_TYPES = ACTION_TYPES;

function navigateToPage(path, fromBrowser) {
  if (fromBrowser === void 0) {
    fromBrowser = false;
  }

  (0, _redux.dispatch)({
    type: ACTION_TYPES.NAVIGATE_TO_PAGE,
    path: path,
    fromBrowser: fromBrowser
  });
}