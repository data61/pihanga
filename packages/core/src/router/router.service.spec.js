import { RouterService, pathToRegexPatternCache } from './router.service';

describe('Service: RouterService', () => {
  describe('findComponentAndExtractParams()', () => {
    const matchRouteConfigPatternFunc = RouterService.matchRouteConfigPattern;

    beforeEach(() => {
      RouterService.matchRouteConfigPattern = jest.fn(() => {
        return { datasetId: 123 };
      });
    });

    afterEach(() => {
      // recover the method that might be mocked during this test suite
      RouterService.matchRouteConfigPattern = matchRouteConfigPatternFunc;
    });

    it('should return the right component for a simple route config', () => {
      const testComponent = jest.fn();
      const testRoutingConfig = {
        '/dataset': testComponent
      };

      const foundComponent = RouterService.findComponentAndExtractParams(testRoutingConfig, '/dataset');

      expect(foundComponent.componentType).toEqual(testComponent);
      expect(foundComponent.routeParamValueByName).toEqual({});

      // since this is a simple match, there is no need to make the pattern check
      expect(RouterService.matchRouteConfigPattern).not.toHaveBeenCalled();
    });

    it('should return the right component for a redirect route', () => {
      const testComponent = jest.fn();
      const testRoutingConfig = {
        '/dataset': '/dataset/dashboard',
        '/dataset/dashboard': testComponent,
      };

      const foundComponent = RouterService.findComponentAndExtractParams(testRoutingConfig, '/dataset');

      expect(foundComponent.componentType).toEqual(testComponent);
      expect(foundComponent.routeParamValueByName).toEqual({});

      // since this is a simple match, there is no need to make the pattern check
      expect(RouterService.matchRouteConfigPattern).not.toHaveBeenCalled();
    });

    it('should return route parameters', () => {
      const testComponent = jest.fn();
      const testRoutingConfig = {
        '/dataset/:datasetId': testComponent
      };

      const foundComponent = RouterService.findComponentAndExtractParams(testRoutingConfig, '/dataset/123');

      expect(RouterService.matchRouteConfigPattern).toHaveBeenCalled();

      expect(foundComponent.componentType).toEqual(testComponent);
      expect(foundComponent.routeParamValueByName).toEqual({
        datasetId: 123,
      });
    });

    it('should deal with empty values', () => {
      expect(
        RouterService.findComponentAndExtractParams(undefined, '')
      ).toEqual({
        componentType: undefined,
        routeParamValueByName: {},
        routePath: '',
      });

      expect(
        RouterService.findComponentAndExtractParams(undefined, undefined)
      ).toEqual({
        componentType: undefined,
        routeParamValueByName: {},
        routePath: undefined,
      });

      expect(
        RouterService.findComponentAndExtractParams({}, undefined)
      ).toEqual({
        componentType: undefined,
        routeParamValueByName: {},
        routePath: undefined,
      });
    });
  });

  describe('matchRouteConfigPattern()', () => {
    it('should return the parameter map if route matches the given pattern', () => {
      const testRoutePath = '/project/123';
      const testRoutePattern = '/project/:projectId';

      const paramValueByName = RouterService.matchRouteConfigPattern(testRoutePath, testRoutePattern);

      expect(paramValueByName).not.toBeUndefined();
      expect(paramValueByName['projectId']).toEqual('123');

      // should also save the keys into the cache
      expect(pathToRegexPatternCache[testRoutePattern]).not.toBeUndefined();
    });

    it('should return null if route path does not match the given pattern', () => {
      const testRoutePath = '/project/123';
      const testRoutePattern = '/overview/:projectId';

      const paramValueByName = RouterService.matchRouteConfigPattern(testRoutePath, testRoutePattern);

      expect(paramValueByName).toBeUndefined();
    });

    it('should deal with empty value', () => {
      expect(RouterService.matchRouteConfigPattern(undefined, '')).toBeUndefined();
      expect(RouterService.matchRouteConfigPattern(undefined, undefined)).toBeUndefined();
      expect(RouterService.matchRouteConfigPattern('', undefined)).toBeUndefined();
    });
  });
});
