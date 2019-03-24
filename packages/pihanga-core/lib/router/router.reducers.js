"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _isFunction = _interopRequireDefault(require("lodash/isFunction"));

var _redux = require("../redux");

var _router = require("./router.actions");

//import environment from 'environments/environment';
var environment = {
  PATH_PREFIX: null
};
var pathPrefix = environment.PATH_PREFIX || '';
var pathPrefixLength = pathPrefix.length;

var _default = function _default(registerReducer, getRoute) {
  registerReducer(_router.ACTION_TYPES.NAVIGATE_TO_PAGE, function (state, action) {
    var path = action.path;

    if (state.route.routePath === path) {
      return state;
    }

    var pa = path.substring(pathPrefixLength).split('/');
    var breadcrumbs = pa.slice(1).map(function (x, i) {
      var p = pathPrefix + pa.slice(0, i + 2).join('/'); //const r = RouterService.findComponentAndExtractParams(routingConfig, p);

      var r = getRoute(p);
      var routeParam = r && r.routeParamValueByName ? r.routeParamValueByName : {};
      var title = r.title ? (0, _isFunction.default)(r.title) ? r.title(routeParam) : r.title : 'Unknown';
      var showInBreadcrumb = !(r.breadcrumb === false);
      return {
        routePath: p,
        routeParam: routeParam,
        pageType: r.type || 'unknown',
        title: title,
        showInBreadcrumb: showInBreadcrumb
      };
    });
    var r = breadcrumbs[breadcrumbs.length - 1];
    setTimeout(function () {
      return (0, _redux.dispatch)((0, _extends2.default)({
        type: _router.ACTION_TYPES.SHOW_PAGE
      }, r));
    });
    return (0, _redux.update)(state, ['route'], (0, _extends2.default)({}, r, {
      fromBrowser: action.fromBrowser,
      breadcrumbs: breadcrumbs
    }));
  });
};

exports.default = _default;