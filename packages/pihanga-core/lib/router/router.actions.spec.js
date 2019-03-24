"use strict";

var _router = require("./router.actions");

var _redux = require("../redux");

jest.mock('../redux', function () {
  return {
    dispatch: jest.fn()
  };
});
describe('Actions: Router', function () {
  it('should execute update route path from browser with the right type', function () {
    var testRoutePath = '/route/path';
    (0, _router.updateRoutePathFromBrowser)(testRoutePath);
    expect(_redux.dispatch).toHaveBeenCalledWith({
      type: _router.ACTION_TYPES.UPDATE_ROUTE_PATH_FROM_BROWSER,
      routePath: testRoutePath
    });
  });
});