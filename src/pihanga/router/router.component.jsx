import React from 'react';
import createHistory from 'history/createBrowserHistory';
import createMemoryHistory from 'history/createMemoryHistory';

import { ExtendedPropTypes } from '../extended-prop-types';
import { RouterService } from './router.service';

/**
 * Append prefix to the all route paths in a given config
 * @param componentByRoutePath
 * @param pathPrefix
 * @returns {{}}
 */
function appendPrefixToRoutePath(componentByRoutePath, pathPrefix) {
  const resultComponentByRoutePath = {};

  Object.keys(componentByRoutePath).forEach(routePath => {
    resultComponentByRoutePath[pathPrefix + routePath] = componentByRoutePath[routePath];
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
export class RouterComponentWrapper {
  constructor(routingConfig, routeNotFoundElementFunc, serverSideRendering) {
    this.routeNotFoundElementFunc = routeNotFoundElementFunc;

    if (serverSideRendering) {
      this.browserHistory = createMemoryHistory();
    } else {
      this.browserHistory = createHistory();
    }

    this.updateRoute = () => {};

    // Listen for changes to the current location (for browser back & forward).
    this.browserHistory.listen(location => {
      if (this.routePath !== location.pathname) {
        this.updateRoute({ path: location.pathname });
      }
    });

    this.routingConfig = routingConfig;
  }

  customise(routeNotFoundElementFunc) {
    this.routeNotFoundElementFunc = routeNotFoundElementFunc;
    return this;
  }

  /**
   * Add route path to the browser history if it is not the current one
   * @param routePath
   */
  addRoutePathToHistory(routePath) {
    if (!routePath) {
      return;
    }

    const currentRoutePath = this.browserHistory.location.pathname;
    if (currentRoutePath !== routePath) {
      this.browserHistory.push(routePath);
    }
  }

  registerRouting(newRoutingConfig, pathPrefix) {
    let tmpRoutingConfig = newRoutingConfig;

    if (pathPrefix) {
      tmpRoutingConfig = appendPrefixToRoutePath(tmpRoutingConfig, pathPrefix);
    }

    // Throw error if there is any duplicate routes
    Object.keys(tmpRoutingConfig)
      .filter(routePath => this.routingConfig[routePath])
      .forEach(duplicate => {
        throw Error(`Route path "${duplicate}" already exists.`);
      });

    Object.keys(tmpRoutingConfig).forEach(routePath => {
      if (routePath === undefined) {
        throw Error('Route path cannot be undefined');
      }

      const component = tmpRoutingConfig[routePath];
      if (!component) {
        throw Error(`Component cannot be undefined for route ${routePath}`);
      }

      // eslint-disable-next-line no-param-reassign
      this.routingConfig[routePath] = component;
    });
  }

  /**
   * @returns {function(*=)} Router's React component
   */
  getRouterComponentConstructor() {
    // To avoid eslint complaining about "react/no-this-in-sfc" where stateless functional
    // components should not use this
    const that = this;

    /**
     * Given a "route" data in "props", retrieve the right component from the config, generated
     * in application bootstrap stage.
     *
     * @param route
     * { route: { path: string, preventAddingHistory: boolean } } props
     *
     * @param updateRoute This function takes three arguments (path, payload, preventAddingHistory)
     * @returns {*}
     * @constructor
     */
    const RouterComponent = ({ route, updateRoute, ...props }) => {
      that.updateRoute = updateRoute;
      that.routePath = route.path;

      const matchedComponent = RouterService.findComponentAndExtractParams(
        that.routingConfig,
        route.path
      );

      if (!matchedComponent.componentType) {
        return that.routeNotFoundElementFunc(route.path);
      }

      if (!route.preventAddingHistory) {
        // add route path to browser history
        // NOTE: If routing config has this configured as a redirect, this route path might be
        // different from the original one from props.
        that.addRoutePathToHistory(matchedComponent.routePath);
      }

      return React.createElement(matchedComponent.componentType, {
        ...props,
        updateRoute,
        route: {
          ...route,
          paramValueByName: matchedComponent.routeParamValueByName
        }
      });
    };

    RouterComponent.propTypes = {
      route: ExtendedPropTypes.route.isRequired,
      updateRoute: ExtendedPropTypes.func.isRequired
    };

    RouterComponent.defaultProps = {};

    return RouterComponent;
  }

  /**
   * @returns {String} Current browser location path value
   */
  getBrowserLocationPath() {
    return this.browserHistory.location.pathname;
  }
}
