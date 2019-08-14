"use strict";

exports.__esModule = true;
exports.default = void 0;

var _redux = require("../redux");

var _logger = require("../logger");

var _router = require("./router.actions");

var logger = (0, _logger.createLogger)('pihanga:router:reducer');

var _default = function _default(registerReducer, browserHistory, opts) {
  var pathPrefix = opts.pathPrefix || '';
  var pathPrefixLength = pathPrefix.length;

  var toPath = function toPath(url) {
    var sa = url.split('?');

    if (sa.length === 2) {// ignoring search
      // const search = sa[1];
    }

    var pa = sa[0].substring(pathPrefixLength).split('/').filter(function (s) {
      return s !== '';
    });
    return pa;
  };

  var toUrl = function toUrl(path) {
    var url = pathPrefix + "/" + path.join('/');
    return url;
  };

  opts.currentPath = function () {
    var pa = toPath(browserHistory.location.pathname);

    if (pa.length === 0 && opts.defPath) {
      var dp = pa = opts.defPath;

      if (Array.isArray(dp)) {
        pa = dp;
      } else {
        pa = dp.split('/').filter(function (s) {
          return s !== '';
        });
      }
    }

    return pa;
  };

  registerReducer(_router.ACTION_TYPES.NAVIGATE_TO_PAGE, function (state, action) {
    var url = action.url;

    if (pathPrefixLength > 0 && !url.startsWith(pathPrefix)) {
      url = pathPrefix + "/" + url;
    }

    if (state.route.url === url) {
      return state;
    }

    var pa = toPath(url);
    (0, _redux.dispatchFromReducer)({
      type: _router.ACTION_TYPES.SHOW_PAGE,
      path: pa
    });
    return (0, _redux.update)(state, ['route'], {
      fromBrowser: action.fromBrowser,
      path: pa,
      url: url
    });
  });
  registerReducer(_router.ACTION_TYPES.SHOW_PAGE, function (state, action) {
    var cp = toUrl(action.path);
    var hp = browserHistory.location.pathname;

    if (cp !== hp) {
      browserHistory.push(cp);
    }

    return state;
  });
  registerReducer('@@INIT', function (state) {
    var cp = toUrl(state.route.path);
    setTimeout(function () {
      return (0, _router.navigateToPage)(cp, true);
    });
    return state;
  });
  browserHistory.listen(function (location, action) {
    // location is an object like window.location
    logger.info("Back in history to", location.pathname);
    setTimeout(function () {
      return (0, _router.navigateToPage)(location.pathname, true);
    });
  });
};

exports.default = _default;