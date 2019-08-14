import { backendLogger } from './backend.logger';
import { createLogger } from 'n1-core';

jest.mock('core', () => ({
  createLogger: jest.fn(() => {
    return {};
  }),
}));

describe('BackendLogger', () => {
  it('should initialise a logger correctly', () => {
    expect(createLogger).toHaveBeenCalled();
    expect(backendLogger).not.toBeUndefined();
  });
});
