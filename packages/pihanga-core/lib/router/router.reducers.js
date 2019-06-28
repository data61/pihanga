"use strict";

exports.__esModule = true;
exports.default = void 0;

var _redux = require("../redux");

var _logger = require("../logger");

var _router = require("./router.actions");

var _ = require(".");

var logger = (0, _logger.createLogger)('pihanga:router:reducer');
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

    if (pa[0] === "") {
      pa.shift();
    }

    (0, _redux.dispatchFromReducer)({
      type: _router.ACTION_TYPES.SHOW_PAGE,
      path: pa
    });
    return (0, _redux.update)(state, ['route'], {
      fromBrowser: action.fromBrowser,
      path: pa
    });
  });
  registerReducer(_router.ACTION_TYPES.SHOW_PAGE, function (state, action) {
    var cp = "/" + action.path.join('/');
    var hp = _.browserHistory.location.pathname;

    if (cp !== hp) {
      _.browserHistory.push(cp);
    }

    return state;
  });

  _.browserHistory.listen(function (location, action) {
    // location is an object like window.location
    logger.info("Back in history to", location.pathname);
    setTimeout(function () {
      return (0, _router.navigateToPage)(location.pathname, true);
    });
  });
};

exports.default = _default;