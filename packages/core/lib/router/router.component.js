"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.RouterComponentWrapper = void 0;

var _react = _interopRequireDefault(require("react"));

var _isString = _interopRequireDefault(require("lodash/isString"));

var _history = require("history");

var _utils = require("../utils");

var _router = require("./router.actions");

var _router2 = require("./router.service");

var _logger = require("../logger");

//import environment from 'environments/environment';
var environment = {
  PATH_PREFIX: null
};
var pathPrefix = environment.PATH_PREFIX || '';
/**
 * Append prefix to the all route paths in a given config
 * @param componentByRoutePath
 * @param pathPrefix
 * @returns {{}}
 */

function appendPrefixToRoutePath(componentByRoutePath, pathPrefix) {
  var resultComponentByRoutePath = {};
  Object.keys(componentByRoutePath).forEach(function (routePath) {
    var component = componentByRoutePath[routePath];

    if ((0, _isString.default)(component)) {
      // is a redirect which needs to be prefixed as well
      component = pathPrefix + component;
    }

    resultComponentByRoutePath[pathPrefix + routePath] = component;
  });
  return resultComponentByRoutePath;
}
/**
 * This is a wrapper around the actual router component
 *
 * This is needed to be able to pass routing config as a parameter in constructor.
 * "connect(s => s)(new RouterComponent(routingConfig))" won't work.
 *
 * We need:
 * "connect(s => s)((new RouterComponentContainer(routingConfig)).getRouterComponentConstructor())"
 */


var RouterComponentWrapper =
/*#__PURE__*/
function () {
  function RouterComponentWrapper(routingConfig, loadingRouteElement, routeNotFoundElementFunc) {
    this.logger = (0, _logger.createLogger)('router');
    this.loadingRouteElement = loadingRouteElement;
    this.routeNotFoundElementFunc = routeNotFoundElementFunc;
    this.browserHistory = (0, _history.createBrowserHistory)();
    this.routingConfig = routingConfig; // Listen for changes to the current location.

    this.browserHistory.listen(function (location) {
      setTimeout(function () {
        (0, _router.navigateToPage)(location.pathname, true);
      });
    });
  }

  var _proto = RouterComponentWrapper.prototype;

  _proto.customise = function customise(loadingRouteElement, routeNotFoundElementFunc) {
    this.loadingRouteElement = loadingRouteElement;
    this.routeNotFoundElementFunc = routeNotFoundElementFunc;
    return this;
  }
  /**
   * Add route path to the browser history if it is not the current one
   * @param routePath
   */
  ;

  _proto.addRoutePathToHistory = function addRoutePathToHistory(routePath) {
    if (!routePath) {
      return;
    }

    var currentRoutePath = this.browserHistory.location.pathname;

    if (currentRoutePath !== routePath) {
      this.browserHistory.push(routePath);
    }
  };

  _proto.registerRouting = function registerRouting(newRoutingConfig) {
    var _this = this;

    var tmpRoutingConfig = newRoutingConfig;

    if (pathPrefix.length > 0) {
      tmpRoutingConfig = appendPrefixToRoutePath(tmpRoutingConfig, pathPrefix);
    } // Throw error if there is any duplicate routes


    Object.keys(tmpRoutingConfig).filter(function (routePath) {
      return _this.routingConfig[routePath];
    }).forEach(function (duplicate) {
      throw Error("Route path \"" + duplicate + "\" already exists.");
    });
    Object.keys(tmpRoutingConfig).forEach(function (routePath) {
      if (routePath === undefined) {
        throw Error('Route path cannot be undefined');
      }

      var opts = tmpRoutingConfig[routePath];

      if (!opts) {
        throw Error("Missing opts for route " + routePath);
      }

      if (typeof opts === "function") {
        var component = opts;
        opts = {
          component: component
        };
      } else if ((0, _isString.default)(opts)) {
        var redirect = opts;
        opts = {
          redirect: redirect
        };
      } // eslint-disable-next-line no-param-reassign


      _this.routingConfig[routePath] = opts;
    });
  };

  _proto.updateRoute = function updateRoute() {
    // TODO: We might want to check if user was previously in a middle of a critical process
    // And open a dialog here to ask user if they'd like to come back to
    // the previously saved state from the backend.
    //
    // If they do, we should not go to the route path from browser location field.
    (0, _router.navigateToPage)(this.browserHistory.location.pathname, true);
  }
  /**
   * @returns routing information for 'path'
   */
  ;

  _proto.getRoute = function getRoute(path) {
    var r = _router2.RouterService.findComponentAndExtractParams(this.routingConfig, path);

    return r;
  }
  /**
   * @returns {function(*=)} Router's React component
   */
  ;

  _proto.getRouterComponentConstructor = function getRouterComponentConstructor() {
    var _this2 = this;

    /**
     * Given a "route" data in "props", retrieve the right component from the config, generated
     * in application bootstrap stage.
     *
     * @param
     * { route: { path: string, preventAddingHistory: boolean }, sessionChecked: boolean } props
     *
     * @returns {*}
     * @constructor
     */
    var RouterComponent = function RouterComponent(props) {
      var route = props.route,
          checkedSession = props.checkedSession; // Only load the page if session data has been checked, to avoid flickering effect of
      // showing some pages, then quickly redirecting user to login page
      //
      // NOTE: It should have been better if each router config can specify
      // whether user needs to be authenticated to access or not. That's overkill for now
      // though, since we don't have other type of permission.

      if (!checkedSession) {
        return _this2.loadingRouteElement;
      }

      var path = route.routePath;

      var matchedComponent = _router2.RouterService.findComponentAndExtractParams(_this2.routingConfig, path);

      if (!matchedComponent.component) {
        _this2.logger.error("Invalid route: " + path);

        return _this2.routeNotFoundElementFunc(path);
      } // pass the map of params to the store
      //route.paramValueByName = matchedComponent.routeParamValueByName;


      if (!route.preventAddingHistory) {
        // add route path to browser history
        // NOTE: If routing config has this configured as a redirect, this route path might be
        // different from the original one from props.
        _this2.addRoutePathToHistory(matchedComponent.routePath);
      }

      var routeEl = _react.default.createElement(matchedComponent.component, props);

      return routeEl;
    };

    RouterComponent.propTypes = {
      route: _utils.PiPropTypes.route.isRequired,
      checkedSession: _utils.PiPropTypes.bool
    };
    RouterComponent.defaultProps = {
      checkedSession: false
    };
    return RouterComponent;
  };

  return RouterComponentWrapper;
}();

exports.RouterComponentWrapper = RouterComponentWrapper;