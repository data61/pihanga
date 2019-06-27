import React from 'react';
import isString from 'lodash/isString';
import { createBrowserHistory as createHistory } from 'history';

import { PiPropTypes } from '../utils';
import { navigateToPage } from './router.actions';
import { RouterService } from './router.service';
import { createLogger } from '../logger';
//import environment from 'environments/environment';

const environment = {
  PATH_PREFIX: null
};
const pathPrefix = environment.PATH_PREFIX || '';

/**
 * Append prefix to the all route paths in a given config
 * @param componentByRoutePath
 * @param pathPrefix
 * @returns {{}}
 */
function appendPrefixToRoutePath(componentByRoutePath, pathPrefix) {
  const resultComponentByRoutePath = {};

  Object
    .keys(componentByRoutePath)
    .forEach((routePath) => {
      let component = componentByRoutePath[routePath];
      if (isString(component)) {
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
export class RouterComponentWrapper {
  constructor(routingConfig, loadingRouteElement, routeNotFoundElementFunc) {
    this.logger = createLogger('router');
    this.loadingRouteElement = loadingRouteElement;
    this.routeNotFoundElementFunc = routeNotFoundElementFunc;
    this.browserHistory = createHistory();
    this.routingConfig = routingConfig;


    // Listen for changes to the current location.
    this.browserHistory.listen((location) => {
      setTimeout(() => {
        navigateToPage(location.pathname, true);
      });
    });
  }

  customise(loadingRouteElement, routeNotFoundElementFunc) {
    this.loadingRouteElement = loadingRouteElement;
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

  registerRouting(newRoutingConfig) {
    let tmpRoutingConfig = newRoutingConfig;
    if (pathPrefix.length > 0) {
      tmpRoutingConfig = appendPrefixToRoutePath(tmpRoutingConfig, pathPrefix);
    }

    // Throw error if there is any duplicate routes
    Object
      .keys(tmpRoutingConfig)
      .filter(routePath => this.routingConfig[routePath])
      .forEach((duplicate) => {
        throw Error(
          `Route path "${duplicate}" already exists.`,
        );
      });

    Object
      .keys(tmpRoutingConfig)
      .forEach((routePath) => {
        if (routePath === undefined) {
          throw Error('Route path cannot be undefined');
        }

        let opts = tmpRoutingConfig[routePath];
        if (!opts) {
          throw Error(`Missing opts for route ${routePath}`);
        }
        if (typeof opts === "function") {
          const component = opts;
          opts = { component };
        } else if (isString(opts)) {
          const redirect = opts;
          opts = { redirect };
        }

        // eslint-disable-next-line no-param-reassign
        this.routingConfig[routePath] = opts;
      });
  }

  updateRoute() {
    // TODO: We might want to check if user was previously in a middle of a critical process
    // And open a dialog here to ask user if they'd like to come back to
    // the previously saved state from the backend.
    //
    // If they do, we should not go to the route path from browser location field.
    navigateToPage(this.browserHistory.location.pathname, true);
  }

  /**
   * @returns routing information for 'path'
   */
  getRoute(path) {
    const r = RouterService.findComponentAndExtractParams(this.routingConfig, path);
    return r;
  }

  /**
   * @returns {function(*=)} Router's React component
   */
  getRouterComponentConstructor() {
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
    const RouterComponent = (props) => {
      const { route, checkedSession } = props;

      // Only load the page if session data has been checked, to avoid flickering effect of
      // showing some pages, then quickly redirecting user to login page
      //
      // NOTE: It should have been better if each router config can specify
      // whether user needs to be authenticated to access or not. That's overkill for now
      // though, since we don't have other type of permission.
      if (!checkedSession) {
        return this.loadingRouteElement;
      }

      const path = route.routePath;
      const matchedComponent = RouterService
        .findComponentAndExtractParams(this.routingConfig, path);

      if (!matchedComponent.component) {
        this.logger.error(`Invalid route: ${path}`);
        return this.routeNotFoundElementFunc(path);
      }

      // pass the map of params to the store
      //route.paramValueByName = matchedComponent.routeParamValueByName;

      if (!route.preventAddingHistory) {
        // add route path to browser history
        // NOTE: If routing config has this configured as a redirect, this route path might be
        // different from the original one from props.
        this.addRoutePathToHistory(matchedComponent.routePath);
      }

      const routeEl = React.createElement(matchedComponent.component, props);
      return routeEl;
    };

    RouterComponent.propTypes = {
      route: PiPropTypes.route.isRequired,
      checkedSession: PiPropTypes.bool,
    };

    RouterComponent.defaultProps = {
      checkedSession: false,
    };

    return RouterComponent;
  }
}
