import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import { RouterComponentWrapper } from './router.component';
import createHistory from 'history/createBrowserHistory';

import { updateRoutePathFromBrowser } from './router.actions';
import { RouterService } from './router.service';
import { createLogger } from '../logger';

/** MOCK EXTERNAL MODULES **/
let mockBrowserHistory = {
  location: {
    pathname: '/test/path',
  },
  listen: jest.fn((func) => {
    func('/test/new/path');
  }),
  push: jest.fn((newPathname) => {
    mockBrowserHistory.location.pathname = newPathname;
  }),
};

jest.mock('history/createBrowserHistory', () => jest.fn(() => mockBrowserHistory));

jest.mock('./router.actions', () => ({
  updateRoutePathFromBrowser: jest.fn(),
}));

jest.mock('./router.service', () => ({
  RouterService: {
    findComponentAndExtractParams: jest.fn(),
    matchRouteConfigPattern: jest.fn(),
  },
}));

jest.mock('../logger', () => ({
  createLogger: jest.fn(() => {
    return {
      error: jest.fn()
    };
  }),
}));

const loadingRouteElement = (
  <p>Loading</p>
);

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
    return (
      <div id="testComponentInjection"></div>
    )
  };

  const VALID_ROUTE_PATH = '/any/path';

  beforeEach(() => {
    testRoutingConfig = {
      [VALID_ROUTE_PATH]: TEST_COMPONENT,
    };

    routerComponentWrapper = new RouterComponentWrapper(
      testRoutingConfig,
      loadingRouteElement,
      routeNotFoundElementFunc,
    );
  });

  it('should initialise component correctly and should subscribe to the browser location change', () => {
    expect(createHistory).toHaveBeenCalled();
    expect(createLogger).toHaveBeenCalled();
    expect(routerComponentWrapper.routingConfig).toEqual(testRoutingConfig);
    expect(mockBrowserHistory.listen).toHaveBeenCalled();
    expect(updateRoutePathFromBrowser).toHaveBeenCalled();
  });

  describe('addRoutePathToHistory()', () => {
    it('should only add NEW route path to the browser history', () => {
      let testNewRoutePath = '/new/route';
      routerComponentWrapper.addRoutePathToHistory(testNewRoutePath);
      expect(mockBrowserHistory.push).toHaveBeenCalledWith(testNewRoutePath);

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

    beforeEach(() => {
      routerComponentWrapper.addRoutePathToHistory = jest.fn();
      RouterComponent = routerComponentWrapper.getRouterComponentConstructor();
    });

    it('should render a loading indicator if session has not been checked', () => {
      const mockRoute = {
        path: '/any/path',
      };

      // Render the router component
      renderer.render(<RouterComponent route={mockRoute} checkedSession={false}/>);

      expect(RouterService.findComponentAndExtractParams).not.toHaveBeenCalled();

      const rendererOutput = renderer.getRenderOutput();
      expect(rendererOutput).toEqual(loadingRouteElement);
    });

    it('should inject the matching component on valid route path', () => {
      const TEST_COMPONENT = () => {
        return (
          <div id="testComponentInjection"></div>
        )
      };

      const VALID_ROUTE_PATH = '/any/path';

      // mock valid route path match
      RouterService.findComponentAndExtractParams.mockReturnValue({
        componentType: TEST_COMPONENT,
        routeParamValueByName: {},
        routePath: VALID_ROUTE_PATH,
      });

      const mockRoute = {
        path: VALID_ROUTE_PATH,
      };

      // Render the router component
      renderer.render(<RouterComponent route={mockRoute} checkedSession={true}/>);

      expect(RouterService.findComponentAndExtractParams).toHaveBeenCalledWith(testRoutingConfig, VALID_ROUTE_PATH);
      expect(routerComponentWrapper.addRoutePathToHistory).toHaveBeenCalledWith(VALID_ROUTE_PATH);

      // Render the component that will be resolved by the router
      const result = renderer.render(
        renderer.getRenderOutput()
      );

      expect(result).toEqual(TEST_COMPONENT());
    });

    it('should inject an error message on invalid route path', () => {
      // mock invalid route match
      RouterService.findComponentAndExtractParams.mockReturnValue({
        componentType: undefined,
        routeParamValueByName: {},
        routePath: '',
      });

      const mockRoute = {
        path: '/invalid/path',
      };

      // Render the router component
      renderer.render(<RouterComponent route={mockRoute} checkedSession={true}/>);

      expect(RouterService.findComponentAndExtractParams).toHaveBeenCalledWith(testRoutingConfig, VALID_ROUTE_PATH);
      expect(routerComponentWrapper.addRoutePathToHistory).not.toHaveBeenCalled();

      // Render the component that will be resolved by the router
      const result = renderer.getRenderOutput();

      expect(result).toEqual(
        <div>
          <p>ERROR: Path &quot;{"/invalid/path"}&quot; does not exist. Please check your URL.</p>
        </div>
      );
    });
  });

});
