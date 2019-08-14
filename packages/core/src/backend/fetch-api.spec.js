import environment from 'environments/environment';
import { backendLogger } from './backend.logger';
import { fetchApi, API_REQUEST_PROPERTIES } from './fetch-api';

jest.mock('../../../environments/environment', () => {
  return { API_BASE: 'http://test.url' };
});

jest.mock('./backend.logger', () => {
  return {
    backendLogger: {
      error: jest.fn(),
    },
  };
});

const mockResponse = (status, statusText, response) => {
  return new window.Response(response, {
    status: status,
    statusText: statusText,
    headers: {
      'Content-type': 'application/json'
    }
  });
};

describe('fetchApi()', () => {
  it('should pass correct request headers and return result on success', async () => {
    const testApiUrl = '/version';
    const mockResponseBody = { versionId: '12345' };

    // mock the global fetch
    window.fetch = jest.fn(() => Promise.resolve(mockResponse(
      200, 'Success', JSON.stringify(mockResponseBody))));

    // NOTE: from Jest v20.0.0, an alternative way is "expect(Promise).resolves.toEqual(...)".
    // Unfortunately, create-react-script currently uses an older version, v18.1.
    await fetchApi(testApiUrl, { extraProperty: 'extra property value' })
      .then(response => {
        expect(response).toEqual(mockResponseBody);
      });

    expect(window.fetch).toHaveBeenCalledWith(environment.API_BASE + testApiUrl, {
      ...API_REQUEST_PROPERTIES,
      extraProperty: 'extra property value',
    });
  });

  it('should log the response and throw an error', async () => {
    const testApiUrl = '/version';

    const testErrorMessage = 'Test internal error';
    const testResponseBody = {data: 'test'};
    const mockErrorResponse = mockResponse(500, testErrorMessage, JSON.stringify(testResponseBody));

    // mock the global fetch
    window.fetch = jest.fn(() => Promise.resolve(mockErrorResponse));

    backendLogger.error.mockClear();
    await fetchApi(testApiUrl, { extraProperty: 'extra property value' })
      .catch((error) => {
        expect(error.message).toEqual(testErrorMessage);
        expect(error.response).toEqual(testResponseBody);
      });

    expect(backendLogger.error).toHaveBeenCalled();
  });

  it('should NOT log the response but still throw an error', async () => {
    const testApiUrl = '/version';

    const testErrorMessage = 'Test internal error';
    const testResponseBody = {data: 'test'};
    const mockErrorResponse = mockResponse(500, testErrorMessage, JSON.stringify(testResponseBody));

    // mock the global fetch
    window.fetch = jest.fn(() => Promise.resolve(mockErrorResponse));

    const silent = true;
    backendLogger.error.mockClear();
    await fetchApi(testApiUrl, { extraProperty: 'extra property value' }, silent)
      .catch((error) => {
        expect(error.message).toEqual(testErrorMessage);
        expect(error.response).toEqual(testResponseBody);
      });

    expect(backendLogger.error).not.toHaveBeenCalled();
  });
});
