"use strict";

var _router = require("./router.service");

describe('Service: RouterService', function () {
  describe('findComponentAndExtractParams()', function () {
    var matchRouteConfigPatternFunc = _router.RouterService.matchRouteConfigPattern;
    beforeEach(function () {
      _router.RouterService.matchRouteConfigPattern = jest.fn(function () {
        return {
          datasetId: 123
        };
      });
    });
    afterEach(function () {
      // recover the method that might be mocked during this test suite
      _router.RouterService.matchRouteConfigPattern = matchRouteConfigPatternFunc;
    });
    it('should return the right component for a simple route config', function () {
      var testComponent = jest.fn();
      var testRoutingConfig = {
        '/dataset': testComponent
      };

      var foundComponent = _router.RouterService.findComponentAndExtractParams(testRoutingConfig, '/dataset');

      expect(foundComponent.componentType).toEqual(testComponent);
      expect(foundComponent.routeParamValueByName).toEqual({}); // since this is a simple match, there is no need to make the pattern check

      expect(_router.RouterService.matchRouteConfigPattern).not.toHaveBeenCalled();
    });
    it('should return the right component for a redirect route', function () {
      var testComponent = jest.fn();
      var testRoutingConfig = {
        '/dataset': '/dataset/dashboard',
        '/dataset/dashboard': testComponent
      };

      var foundComponent = _router.RouterService.findComponentAndExtractParams(testRoutingConfig, '/dataset');

      expect(foundComponent.componentType).toEqual(testComponent);
      expect(foundComponent.routeParamValueByName).toEqual({}); // since this is a simple match, there is no need to make the pattern check

      expect(_router.RouterService.matchRouteConfigPattern).not.toHaveBeenCalled();
    });
    it('should return route parameters', function () {
      var testComponent = jest.fn();
      var testRoutingConfig = {
        '/dataset/:datasetId': testComponent
      };

      var foundComponent = _router.RouterService.findComponentAndExtractParams(testRoutingConfig, '/dataset/123');

      expect(_router.RouterService.matchRouteConfigPattern).toHaveBeenCalled();
      expect(foundComponent.componentType).toEqual(testComponent);
      expect(foundComponent.routeParamValueByName).toEqual({
        datasetId: 123
      });
    });
    it('should deal with empty values', function () {
      expect(_router.RouterService.findComponentAndExtractParams(undefined, '')).toEqual({
        componentType: undefined,
        routeParamValueByName: {},
        routePath: ''
      });
      expect(_router.RouterService.findComponentAndExtractParams(undefined, undefined)).toEqual({
        componentType: undefined,
        routeParamValueByName: {},
        routePath: undefined
      });
      expect(_router.RouterService.findComponentAndExtractParams({}, undefined)).toEqual({
        componentType: undefined,
        routeParamValueByName: {},
        routePath: undefined
      });
    });
  });
  describe('matchRouteConfigPattern()', function () {
    it('should return the parameter map if route matches the given pattern', function () {
      var testRoutePath = '/project/123';
      var testRoutePattern = '/project/:projectId';

      var paramValueByName = _router.RouterService.matchRouteConfigPattern(testRoutePath, testRoutePattern);

      expect(paramValueByName).not.toBeUndefined();
      expect(paramValueByName['projectId']).toEqual('123'); // should also save the keys into the cache

      expect(_router.pathToRegexPatternCache[testRoutePattern]).not.toBeUndefined();
    });
    it('should return null if route path does not match the given pattern', function () {
      var testRoutePath = '/project/123';
      var testRoutePattern = '/overview/:projectId';

      var paramValueByName = _router.RouterService.matchRouteConfigPattern(testRoutePath, testRoutePattern);

      expect(paramValueByName).toBeUndefined();
    });
    it('should deal with empty value', function () {
      expect(_router.RouterService.matchRouteConfigPattern(undefined, '')).toBeUndefined();
      expect(_router.RouterService.matchRouteConfigPattern(undefined, undefined)).toBeUndefined();
      expect(_router.RouterService.matchRouteConfigPattern('', undefined)).toBeUndefined();
    });
  });
});