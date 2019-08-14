import { ACTION_TYPES, updateRoutePathFromBrowser } from './router.actions';
import { dispatch } from '../redux';

jest.mock('../redux', () => ({
  dispatch: jest.fn(),
}));

describe('Actions: Router', () => {
  it('should execute update route path from browser with the right type', () => {
    const testRoutePath = '/route/path';
    updateRoutePathFromBrowser(testRoutePath);

    expect(dispatch).toHaveBeenCalledWith({
      type: ACTION_TYPES.UPDATE_ROUTE_PATH_FROM_BROWSER,
      routePath: testRoutePath,
    });
  });
});
