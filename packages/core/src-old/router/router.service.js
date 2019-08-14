import pathToRegexp from 'path-to-regexp';

export const pathToRegexPatternCache = {};

/**
 * This class represents common actions to interact with the router component.
 */
export class RouterService {
  /**
   * Given a route path, find the associated view component and extract parameters from the given
   * routing config.
   *
   * Example:
   * Given:
   * - Route path: '/dataset'
   * - RoutingConfig: {'/dataset': DatasetComponent, '/project/:projectId': ProjectComponent }
   * Return: DatasetComponent without any params
   *
   * But, if route path is: '/project/555', this method will return Component2, with a map of
   * { id: 555 }
   *
   * @param routingConfig Should be in a form of {'/dataset': { component: DatasetComponent },
    * '/project/:projectId': { component: ProjectComponent }
   * @param routePath Should be something like '/dataset'
   * @returns {{componentType: *, routeParamValueByName: *}}
   */
  static findComponentAndExtractParams(routingConfig, routePath) {
    // Find the component associated with the given route,
    // and extract a map of parameters from the route path
    let path = routePath;
    // if (routePath.startsWith("/static/ui/")) {
    //   path = routePath.substring("/static/ui/".length - 1);
    // }
    //let componentType;
    let routeParamValueByName = {};
    let opts = {};

    if (routingConfig && path) {
      // try our luck with a simple O(1) lookup
      opts = routingConfig[path];
      if (opts) {
        // detect a redirect
        if (opts.redirect) {
          return RouterService.findComponentAndExtractParams(routingConfig, opts.redirect);
        }
      } else {
        // a nasty loop to check if it matches any route config
        // need to disable an eslint rule here. Because we need to terminate this loop as soon as
        // we find a matched route path - we can't terminate mid-way through with
        // Object.keys(...)

        // eslint-disable-next-line no-restricted-syntax
        for (const routePattern in routingConfig) {
          if (Object.hasOwnProperty.call(routingConfig, routePattern)) {
            const paramValueByName = RouterService.matchRouteConfigPattern(path, routePattern);
            if (paramValueByName) {
              // we found it
              opts = routingConfig[routePattern];
              routeParamValueByName = paramValueByName;
              break;
            }
          }
        }
      }
    }

    return {
      routePath,
      routeParamValueByName,
      ...opts,
    };
  }

  /**
   * Check if the given route path matches with the given route config.
   *
   * Example:
   * Given:
   * - Route path: "/user/huy/project/123"
   * - Routing config pattern: "/user/:username/project/:projectId"
   * This will be a match. And the method will return a map of all parameters:
   * { username: huy, projectId: 123 }
   *
   * @param {string} routePath
   * @param {string} routeConfigPattern
   * @returns {*} Return the map of all parameter value by its name
   */
  static matchRouteConfigPattern(routePath, routeConfigPattern) {
    if (!routeConfigPattern) {
      return undefined;
    }

    let keys = [];
    let pattern;

    // Check if we have done this before
    if (pathToRegexPatternCache[routeConfigPattern]) {
      keys = pathToRegexPatternCache[routeConfigPattern].keys;
      pattern = pathToRegexPatternCache[routeConfigPattern].pattern;
    } else {
      // Convert the route config to a pattern that can be used to compare with the route path
      pattern = pathToRegexp(routeConfigPattern, keys);

      // cache this conversion since it is not too trivial task
      pathToRegexPatternCache[routeConfigPattern] = {
        keys,
        pattern,
      };
    }

    const match = pattern.exec(routePath);
    if (!match) {
      return undefined;
    }

    const parameterValueByName = {};
    // pathToRegexp library has all the params
    for (let i = 1; i < match.length; i++) {
      parameterValueByName[keys[i - 1].name] =
        match[i] !== undefined ? match[i] : undefined;
    }

    return parameterValueByName;
  }
}
