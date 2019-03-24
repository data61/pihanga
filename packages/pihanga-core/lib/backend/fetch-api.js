"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.fetchApi = fetchApi;
exports.isConnectionError = isConnectionError;
exports.API_REQUEST_PROPERTIES = exports.AUTH_TOKEN_COOKIE_NAME = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

require("whatwg-fetch");

var _environment = _interopRequireDefault(require("environments/environment"));

var _backend = require("./backend.logger");

var _backend2 = require("./backend.actions");

var _browserCookie = require("./browser-cookie");

var AUTH_TOKEN_COOKIE_NAME = 'AUTH_TOKEN'; // The value of this header will be checked by server. If missing, server will return 401 for
// restricted access API

exports.AUTH_TOKEN_COOKIE_NAME = AUTH_TOKEN_COOKIE_NAME;
var AUTH_TOKEN_HEADER = 'N1-Api-Key';
/**
 * Common API request properties
 * @type {{headers: {Content-Type: string}, credentials: string}}
 */

var API_REQUEST_PROPERTIES = {
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include'
};
/**
 * Unwrap data
 * @param response
 * @returns {Object}
 */

exports.API_REQUEST_PROPERTIES = API_REQUEST_PROPERTIES;

function unwrapData(response) {
  // Handle no content because response.json() doesn't handle it
  if (response.status === 204) {
    return {};
  }

  return response.json();
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


function checkStatusOrThrowError(_x, _x2, _x3) {
  return _checkStatusOrThrowError.apply(this, arguments);
}
/**
 * @param apiUrl Should contain a leading "/"
 * @param request
 * @param silent If true, there won't be any logging
 * @returns {Promise} - NOTE: Error has been logged
 */


function _checkStatusOrThrowError() {
  _checkStatusOrThrowError = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(url, response, silent) {
    var error;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(response.status >= 200 && response.status < 300)) {
              _context.next = 2;
              break;
            }

            return _context.abrupt("return", response);

          case 2:
            // don't throw or log any error
            if (!silent) {
              if (response.status === 401) {
                (0, _backend2.throwUnauthorisedError)();
              } else if (response.status === 403) {
                (0, _backend2.throwPermissionDeniedError)();
              }

              _backend.backendLogger.error("Request for '" + url + "' failed", response);
            } // Client code might be interested in doing something with the error, and the original response


            error = new Error(response.statusText);
            _context.prev = 4;
            _context.next = 7;
            return response.json();

          case 7:
            error.response = _context.sent;
            error.status = response.status;
            _context.next = 14;
            break;

          case 11:
            _context.prev = 11;
            _context.t0 = _context["catch"](4);
            // ignoring the error of getting json data from response
            error.response = response;

          case 14:
            throw error;

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[4, 11]]);
  }));
  return _checkStatusOrThrowError.apply(this, arguments);
}

function fetchApi(apiUrl, request, silent) {
  var fullApiUrl = "" + _environment.default.API_BASE + apiUrl; // Need to stringtify JSON object

  var tmpRequest = request;

  if (tmpRequest && tmpRequest.body && typeof tmpRequest.body !== 'string') {
    tmpRequest.body = JSON.stringify(tmpRequest.body);
  }

  var requestProperties = (0, _extends2.default)({}, API_REQUEST_PROPERTIES, tmpRequest);
  var apiAuthToken = (0, _browserCookie.getCookie)(AUTH_TOKEN_COOKIE_NAME);

  if (apiAuthToken) {
    requestProperties.headers[AUTH_TOKEN_HEADER] = apiAuthToken;
  } // NOTE: The Promise returned from fetch() won't reject on HTTP error status even if the response
  // is an HTTP 404 or 500


  return fetch(fullApiUrl, requestProperties).then(function (response) {
    return checkStatusOrThrowError(fullApiUrl, response, silent);
  }).then(unwrapData);
}
/**
 * @param error
 * @returns {boolean} True if there is a problem connecting to the API
 */


function isConnectionError(error) {
  var INTERNAL_FETCH_ERROR = 'Failed to fetch';
  return error && error.message === INTERNAL_FETCH_ERROR;
}