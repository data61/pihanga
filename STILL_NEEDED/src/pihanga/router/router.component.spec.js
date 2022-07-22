import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import { RouterComponentWrapper } from './router.component';
import createHistory from 'history/createBrowserHistory';

import { RouterService } from './router.service';

/** MOCK EXTERNAL MODULES **/
let mockBrowserHistory = {
  location: {
    pathname: '/test/path'
  },
  listen: jest.fn(func => {
    func('/test/new/path');
  }),
  push: jest.fn(newPathname => {
    mockBrowserHistory.location.pathname = newPathname;
  })
};

jest.mock('history/createBrowserHistory', () => jest.fn(() => mockBrowserHistory));

jest.mock('./router.service', () => ({
  RouterService: {
    findComponentAndExtractParams: jest.fn(),
    matchRouteConfigPattern: jest.fn()
  }
}));

const routeNotFoundElementFunc = invalidRoutePath => (
  <div>
    <p>ERROR: Path &quot;{invalidRoutePath}&quot; does not exist. Please check your URL.</p>
  </div>
);

/** MAIN TESTS **/
describe('Wrapper: RouterComponentWrapper', () => {
  let testRoutingConfig;
  let routerComponentWrapper;

  const TEST_COMPONENT = () => {
    return <div id="testComponentInjection" />;
  };

  const VALID_ROUTE_PATH = '/any/path';

  beforeEach(() => {
    testRoutingConfig = {
      [VALID_ROUTE_PATH]: TEST_COMPONENT
    };

    routerComponentWrapper = new RouterComponentWrapper(testRoutingConfig, <div />);

    routerComponentWrapper.customise(routeNotFoundElementFunc);
  });

  it('should initialise component correctly and should subscribe to the browser location change', () => {
    expect(createHistory).toHaveBeenCalled();
    expect(routerComponentWrapper.routingConfig).toEqual(testRoutingConfig);
    expect(mockBrowserHistory.listen).toHaveBeenCalled();
  });

  describe('addRoutePathToHistory()', () => {
    it('should only add NEW route path to the browser history', () => {
      let testNewRoutePath = '/new/route';
      routerComponentWrapper.addRoutePathToHistory(testNewRoutePath);
      expect(mockBrowserHistory.push).toHaveBeenCalledWith(testNewRoutePath);
      expect(routerComponentWrapper.getBrowserLocationPath()).toEqual(testNewRoutePath);

      mockBrowserHistory.push.mockReset();

      // Push() should not be called since this route path is already added to the history
      routerComponentWrapper.addRoutePathToHistory(testNewRoutePath);
      expect(mockBrowserHistory.push).not.toHaveBeenCalled();
    });

    it('should deal with empty values', () => {
      routerComponentWrapper.addRoutePathToHistory(undefined);
      expect(mockBrowserHistory.push).not.toHaveBeenCalled();
    });
  });

  describe('Component: RouterComponent', () => {
    const renderer = new ReactShallowRenderer();
    let RouterComponent;
    let updateRoute;

    beforeEach(() => {
      routerComponentWrapper.addRoutePathToHistory = jest.fn();
      RouterComponent = routerComponentWrapper.getRouterComponentConstructor();
      updateRoute = jest.fn();
    });

    it('should inject the matching component on valid route path', () => {
      const TEST_COMPONENT = () => {
        return <div id="testComponentInjection" />;
      };

      const VALID_ROUTE_PATH = '/any/path';

      // mock valid route path match
      RouterService.findComponentAndExtractParams.mockReturnValue({
        componentType: TEST_COMPONENT,
        routeParamValueByName: {},
        routePath: VALID_ROUTE_PATH
      });

      const mockRoute = {
        path: VALID_ROUTE_PATH
      };

      // Render the router component
      renderer.render(<RouterComponent route={mockRoute} updateRoute={updateRoute} />);

      expect(RouterService.findComponentAndExtractParams).toHaveBeenCalledWith(
        testRoutingConfig,
        VALID_ROUTE_PATH
      );
      expect(routerComponentWrapper.addRoutePathToHistory).toHaveBeenCalledWith(VALID_ROUTE_PATH);

      // Render the component that will be resolved by the router
      const result = renderer.render(renderer.getRenderOutput());

      expect(result).toEqual(TEST_COMPONENT());
    });

    it('should inject an error message on invalid route path', () => {
      // mock invalid route match
      RouterService.findComponentAndExtractParams.mockReturnValue({
        componentType: undefined,
        routeParamValueByName: {},
        routePath: ''
      });

      const mockRoute = {
        path: '/invalid/path'
      };

      // Render the router component
      renderer.render(<RouterComponent route={mockRoute} updateRoute={updateRoute} />);

      expect(RouterService.findComponentAndExtractParams).toHaveBeenCalledWith(
        testRoutingConfig,
        VALID_ROUTE_PATH
      );
      expect(routerComponentWrapper.addRoutePathToHistory).not.toHaveBeenCalled();

      // Render the component that will be resolved by the router
      const result = renderer.getRenderOutput();

      expect(result).toEqual(
        <div>
          <p>ERROR: Path &quot;{'/invalid/path'}&quot; does not exist. Please check your URL.</p>
        </div>
      );
    });
  });
});
