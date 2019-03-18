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
   * @param routingConfig Should be in a form of {'/dataset': DatasetComponent,
    * '/project/:projectId': ProjectComponent }
   * @param routePath Should be something like '/dataset'
   * @returns {{componentType: *, routeParamValueByName: *}}
   */
  static findComponentAndExtractParams(routingConfig, routePath) {
    // Find the component associated with the given route,
    // and extract a map of parameters from the route path
    let compType;
    let routeParamValueByName = {};

    if (routingConfig && routePath) {
      // try our luck with a simple O(1) lookup
      compType = routingConfig[routePath];

      // detect a redirect
      if (typeof compType === 'string') {
        return RouterService.findComponentAndExtractParams(routingConfig, compType);
      }

      if (!compType) {
        const foundItem = Object
          .entries(routingConfig)
          .find((item) => {
            const routePattern = item[0];
            routeParamValueByName = RouterService.matchRouteConfigPattern(routePath, routePattern);
            return routeParamValueByName;
          });

        compType = (foundItem && foundItem[1]) || undefined;
      }
    }

    return {
      routePath,
      componentType: compType,
      routeParamValueByName: routeParamValueByName || {},
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
      // to avoid violating eslint rule “prefer-destructuring”
      const { _keys, _pattern } = pathToRegexPatternCache[routeConfigPattern];
      keys = _keys;
      pattern = _pattern;
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
      parameterValueByName[keys[i - 1].name] = match[i];
    }

    return parameterValueByName;
  }
}
