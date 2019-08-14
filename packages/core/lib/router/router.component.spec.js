"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _react = _interopRequireDefault(require("react"));

var _shallow = _interopRequireDefault(require("react-test-renderer/shallow"));

var _router = require("./router.component");

var _createBrowserHistory = _interopRequireDefault(require("history/createBrowserHistory"));

var _router2 = require("./router.actions");

var _router3 = require("./router.service");

var _logger = require("../logger");

/** MOCK EXTERNAL MODULES **/
var mockBrowserHistory = {
  location: {
    pathname: '/test/path'
  },
  listen: jest.fn(function (func) {
    func('/test/new/path');
  }),
  push: jest.fn(function (newPathname) {
    mockBrowserHistory.location.pathname = newPathname;
  })
};
jest.mock('history/createBrowserHistory', function () {
  return jest.fn(function () {
    return mockBrowserHistory;
  });
});
jest.mock('./router.actions', function () {
  return {
    updateRoutePathFromBrowser: jest.fn()
  };
});
jest.mock('./router.service', function () {
  return {
    RouterService: {
      findComponentAndExtractParams: jest.fn(),
      matchRouteConfigPattern: jest.fn()
    }
  };
});
jest.mock('../logger', function () {
  return {
    createLogger: jest.fn(function () {
      return {
        error: jest.fn()
      };
    })
  };
});

var loadingRouteElement = _react.default.createElement("p", null, "Loading");

var routeNotFoundElementFunc = function routeNotFoundElementFunc(invalidRoutePath) {
  return _react.default.createElement("div", null, _react.default.createElement("p", null, "ERROR: Path \"", invalidRoutePath, "\" does not exist. Please check your URL."));
};
/** MAIN TESTS **/


describe('Wrapper: RouterComponentWrapper', function () {
  var testRoutingConfig;
  var routerComponentWrapper;

  var TEST_COMPONENT = function TEST_COMPONENT() {
    return _react.default.createElement("div", {
      id: "testComponentInjection"
    });
  };

  var VALID_ROUTE_PATH = '/any/path';
  beforeEach(function () {
    var _testRoutingConfig;

    testRoutingConfig = (_testRoutingConfig = {}, _testRoutingConfig[VALID_ROUTE_PATH] = TEST_COMPONENT, _testRoutingConfig);
    routerComponentWrapper = new _router.RouterComponentWrapper(testRoutingConfig, loadingRouteElement, routeNotFoundElementFunc);
  });
  it('should initialise component correctly and should subscribe to the browser location change', function () {
    expect(_createBrowserHistory.default).toHaveBeenCalled();
    expect(_logger.createLogger).toHaveBeenCalled();
    expect(routerComponentWrapper.routingConfig).toEqual(testRoutingConfig);
    expect(mockBrowserHistory.listen).toHaveBeenCalled();
    expect(_router2.updateRoutePathFromBrowser).toHaveBeenCalled();
  });
  describe('addRoutePathToHistory()', function () {
    it('should only add NEW route path to the browser history', function () {
      var testNewRoutePath = '/new/route';
      routerComponentWrapper.addRoutePathToHistory(testNewRoutePath);
      expect(mockBrowserHistory.push).toHaveBeenCalledWith(testNewRoutePath);
      mockBrowserHistory.push.mockReset(); // Push() should not be called since this route path is already added to the history

      routerComponentWrapper.addRoutePathToHistory(testNewRoutePath);
      expect(mockBrowserHistory.push).not.toHaveBeenCalled();
    });
    it('should deal with empty values', function () {
      routerComponentWrapper.addRoutePathToHistory(undefined);
      expect(mockBrowserHistory.push).not.toHaveBeenCalled();
    });
  });
  describe('Component: RouterComponent', function () {
    var renderer = new _shallow.default();
    var RouterComponent;
    beforeEach(function () {
      routerComponentWrapper.addRoutePathToHistory = jest.fn();
      RouterComponent = routerComponentWrapper.getRouterComponentConstructor();
    });
    it('should render a loading indicator if session has not been checked', function () {
      var mockRoute = {
        path: '/any/path'
      }; // Render the router component

      renderer.render(_react.default.createElement(RouterComponent, {
        route: mockRoute,
        checkedSession: false
      }));
      expect(_router3.RouterService.findComponentAndExtractParams).not.toHaveBeenCalled();
      var rendererOutput = renderer.getRenderOutput();
      expect(rendererOutput).toEqual(loadingRouteElement);
    });
    it('should inject the matching component on valid route path', function () {
      var TEST_COMPONENT = function TEST_COMPONENT() {
        return _react.default.createElement("div", {
          id: "testComponentInjection"
        });
      };

      var VALID_ROUTE_PATH = '/any/path'; // mock valid route path match

      _router3.RouterService.findComponentAndExtractParams.mockReturnValue({
        componentType: TEST_COMPONENT,
        routeParamValueByName: {},
        routePath: VALID_ROUTE_PATH
      });

      var mockRoute = {
        path: VALID_ROUTE_PATH
      }; // Render the router component

      renderer.render(_react.default.createElement(RouterComponent, {
        route: mockRoute,
        checkedSession: true
      }));
      expect(_router3.RouterService.findComponentAndExtractParams).toHaveBeenCalledWith(testRoutingConfig, VALID_ROUTE_PATH);
      expect(routerComponentWrapper.addRoutePathToHistory).toHaveBeenCalledWith(VALID_ROUTE_PATH); // Render the component that will be resolved by the router

      var result = renderer.render(renderer.getRenderOutput());
      expect(result).toEqual(TEST_COMPONENT());
    });
    it('should inject an error message on invalid route path', function () {
      // mock invalid route match
      _router3.RouterService.findComponentAndExtractParams.mockReturnValue({
        componentType: undefined,
        routeParamValueByName: {},
        routePath: ''
      });

      var mockRoute = {
        path: '/invalid/path'
      }; // Render the router component

      renderer.render(_react.default.createElement(RouterComponent, {
        route: mockRoute,
        checkedSession: true
      }));
      expect(_router3.RouterService.findComponentAndExtractParams).toHaveBeenCalledWith(testRoutingConfig, VALID_ROUTE_PATH);
      expect(routerComponentWrapper.addRoutePathToHistory).not.toHaveBeenCalled(); // Render the component that will be resolved by the router

      var result = renderer.getRenderOutput();
      expect(result).toEqual(_react.default.createElement("div", null, _react.default.createElement("p", null, "ERROR: Path \"", "/invalid/path", "\" does not exist. Please check your URL.")));
    });
  });
});