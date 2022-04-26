import { fetch } from 'whatwg-fetch';

// import { backendLogger } from './backend.logger';
import {
  throwUnauthorisedError,
  throwPermissionDeniedError,
  throwNotFoundError,
} from './rest.actions';
import { getCookie } from './browser-cookie';
import { createLogger } from '../logger';

export const logger = createLogger('rest-client.fetch');

const Config = {
  API_BASE: '',
  AUTH_TOKEN_COOKIE_NAME: undefined, //'AUTH_TOKEN',
  // The value of this header will be checked by server. If missing, server will return 401 for
  // restricted access API
  AUTH_TOKEN_HEADER: undefined, // 'N1-Api-Key',
};

/**
 * Common API request properties
 * @type {{headers: {Content-Type: string}, credentials: string}}
 */
export const API_REQUEST_PROPERTIES = {
  credentials: 'include',
};

export function config(cfg) {
  Object.keys(Config).forEach((k) => {
    if (cfg[k]) {
      Config[k] = cfg[k];
    }
  });
}

/**
 * Unwrap data
 * @param response
 * @returns {Object}
 */
function decodeReply(response) {
  // Handle no content because response.json() doesn't handle it
  if (response.status === 204) {
    return {};
  }
  const contentType = response.headers.get('content-type');
  if (contentType) {
    switch (contentType) {
      case 'application/json':
        return response.json().then((j) => [j, contentType]);
      case 'application/jose':
        return response.text().then((t) => [t, contentType]);
      default:
        if (contentType.startsWith('text')) {
          return response.text().then((t) => [t, contentType]);
        }
    }
  }
  // catch all
  return response.blob().then((b) => [b, contentType]);
  // if (!contentType || !contentType.includes('application/json')) {
  //   return response.
  //   return Promise.resolve([{
  //     contentType,
  //     response,
  //   }, contentType]);
  // } else {
  //   return response.json().then((j) => [j, contentType]);
  // }
}

/**
 * Check the response from the server
 * Log and throw the error if response status is a HTTP error code, since client code might be
 * interested to deal with these errors
 *
 * @param url
 * @param response
 * @param silent If true, there won't be any logging
 * @returns {*}
 * @throws Error
 */
async function checkStatusOrThrowError(url, response, silent) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  // don't throw or log any error
  if (!silent) {
    if (response.status === 401) {
      throwUnauthorisedError(url);
    } else if (response.status === 403) {
      throwPermissionDeniedError(url);
    } else if (response.status === 404) {
      throwNotFoundError(url);
    } else {
      logger.error(`Request for '${url}' failed`, response);
    }
  }

  // Client code might be interested in doing something with the error, and the original response
  const error = new Error(response.statusText);

  try {
    error.response = await response.json();
    error.status = response.status;
  } catch (e) {
    // ignoring the error of getting json data from response
    error.response = response;
  }
  throw error;
}

/**
 * @param apiUrl Should contain a leading "/"
 * @param request
 * @param silent If true, there won't be any logging
 * @returns {Promise} - NOTE: Error has been logged
 */
export function fetchApi(apiUrl, request, silent) {
  const fullApiUrl = `${Config.API_BASE}${apiUrl}`;
  const method = (request || {}).method || 'GET';

  // Need to stringtify JSON object or create form data for 
  const tmpRequest = request;
  let contentType = null;
  if (tmpRequest && tmpRequest.body && typeof (tmpRequest.body) !== 'string') {
    // eslint-disable-next-line no-undef
    if (tmpRequest.body instanceof FormData) {
      contentType = undefined; // will default to 'multipart/form-data; boundary=`';
    } else {
      tmpRequest.body = JSON.stringify(tmpRequest.body);
      contentType = 'application/json';
    }
    // NOT SURE WHY I HAD THIS CODE. Json is default, and otherwise supply FormData
    // } else if (method === 'GET') {
    //   tmpRequest.body = JSON.stringify(tmpRequest.body);
    //   contentType = 'application/json';
    // } else {
    //   const form = new URLSearchParams(); // new FormData();
    //   Object.entries(tmpRequest.body).forEach(([k, v]) => {
    //     form.append(k, v);
    //   });
    //   tmpRequest.body = form;
    //   contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
    // }
  }
  const headers = { ...API_REQUEST_PROPERTIES.headers || {} };
  if (contentType) {
    headers['Content-Type'] = contentType;
  }
  const requestProperties = {
    ...API_REQUEST_PROPERTIES,
    headers,
    ...tmpRequest,
  };

  if (Config.AUTH_TOKEN_COOKIE_NAME) {
    const apiAuthToken = getCookie(Config.AUTH_TOKEN_COOKIE_NAME);
    if (apiAuthToken) {
      requestProperties.headers[Config.AUTH_TOKEN_HEADER] = apiAuthToken;
    }
  }

  // NOTE: The Promise returned from fetch() won't reject on HTTP error status even if the response
  // is an HTTP 404 or 500
  return fetch(fullApiUrl, requestProperties)
    .then((response) => checkStatusOrThrowError(fullApiUrl, response, silent))
    .then(decodeReply);
}

/**
 * @param error
 * @returns {boolean} True if there is a problem connecting to the API
 */
export function isConnectionError(error) {
  const INTERNAL_FETCH_ERROR = 'Failed to fetch';
  return error && error.message === INTERNAL_FETCH_ERROR;
}
