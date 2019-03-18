import { loadModules } from 'pihanga';
import { requireContext as requireContextPolyfill } from './require-context.polyfill';

describe('bootstrap app', () => {
  it('should initialise all modules without any errors', () => {
    // NOTE: the argument to this function must be manually matched with the ones from
    // "require-context.js"
    const moduleByFilePath = requireContextPolyfill('./', true, /\.(\/[^/]*){2,}(.)*.module\.js$/);

    const router = loadModules(process.env.REACT_APP_LOG_LEVEL, moduleByFilePath, () => {});

    // it should have at least a component for routing
    expect(router.routingConfig['/']).not.toBeUndefined();
  });
});
