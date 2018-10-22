import { bootstrapApp, requireContextArgList } from './index';
import { requireContext } from './require-context';
import { requireContext as requireContextPolyfill } from './require-context.polyfill';

jest.mock('./require-context', () => ({
  requireContext: jest.fn(),
}));

describe('bootstrap app', () => {
  it('should initialise all modules without any errors', () => {
    document.getElementById = jest.fn(() => document.createElement('div'));

    // NOTE: the argument to this function must be manually matched with the ones from
    // "require-context.js"
    const moduleByFilePath = requireContextPolyfill('./', true, /\.(\/[^/]*){2,}index\.js$/);

    requireContext.mockReturnValue(moduleByFilePath);
    const elementId = 'elementId';

    bootstrapApp(elementId);

    expect(requireContext).toHaveBeenCalled();
    expect(document.getElementById).toHaveBeenCalledWith(elementId);
  });
});
