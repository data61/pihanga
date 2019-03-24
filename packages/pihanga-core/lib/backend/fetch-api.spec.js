"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _environment = _interopRequireDefault(require("environments/environment"));

var _backend = require("./backend.logger");

var _fetchApi = require("./fetch-api");

jest.mock('../../../environments/environment', function () {
  return {
    API_BASE: 'http://test.url'
  };
});
jest.mock('./backend.logger', function () {
  return {
    backendLogger: {
      error: jest.fn()
    }
  };
});

var mockResponse = function mockResponse(status, statusText, response) {
  return new window.Response(response, {
    status: status,
    statusText: statusText,
    headers: {
      'Content-type': 'application/json'
    }
  });
};

describe('fetchApi()', function () {
  it('should pass correct request headers and return result on success',
  /*#__PURE__*/
  (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee() {
    var testApiUrl, mockResponseBody;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            testApiUrl = '/version';
            mockResponseBody = {
              versionId: '12345'
            }; // mock the global fetch

            window.fetch = jest.fn(function () {
              return Promise.resolve(mockResponse(200, 'Success', JSON.stringify(mockResponseBody)));
            }); // NOTE: from Jest v20.0.0, an alternative way is "expect(Promise).resolves.toEqual(...)".
            // Unfortunately, create-react-script currently uses an older version, v18.1.

            _context.next = 5;
            return (0, _fetchApi.fetchApi)(testApiUrl, {
              extraProperty: 'extra property value'
            }).then(function (response) {
              expect(response).toEqual(mockResponseBody);
            });

          case 5:
            expect(window.fetch).toHaveBeenCalledWith(_environment.default.API_BASE + testApiUrl, (0, _extends2.default)({}, _fetchApi.API_REQUEST_PROPERTIES, {
              extraProperty: 'extra property value'
            }));

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
  it('should log the response and throw an error',
  /*#__PURE__*/
  (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2() {
    var testApiUrl, testErrorMessage, testResponseBody, mockErrorResponse;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            testApiUrl = '/version';
            testErrorMessage = 'Test internal error';
            testResponseBody = {
              data: 'test'
            };
            mockErrorResponse = mockResponse(500, testErrorMessage, JSON.stringify(testResponseBody)); // mock the global fetch

            window.fetch = jest.fn(function () {
              return Promise.resolve(mockErrorResponse);
            });

            _backend.backendLogger.error.mockClear();

            _context2.next = 8;
            return (0, _fetchApi.fetchApi)(testApiUrl, {
              extraProperty: 'extra property value'
            }).catch(function (error) {
              expect(error.message).toEqual(testErrorMessage);
              expect(error.response).toEqual(testResponseBody);
            });

          case 8:
            expect(_backend.backendLogger.error).toHaveBeenCalled();

          case 9:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  })));
  it('should NOT log the response but still throw an error',
  /*#__PURE__*/
  (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee3() {
    var testApiUrl, testErrorMessage, testResponseBody, mockErrorResponse, silent;
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            testApiUrl = '/version';
            testErrorMessage = 'Test internal error';
            testResponseBody = {
              data: 'test'
            };
            mockErrorResponse = mockResponse(500, testErrorMessage, JSON.stringify(testResponseBody)); // mock the global fetch

            window.fetch = jest.fn(function () {
              return Promise.resolve(mockErrorResponse);
            });
            silent = true;

            _backend.backendLogger.error.mockClear();

            _context3.next = 9;
            return (0, _fetchApi.fetchApi)(testApiUrl, {
              extraProperty: 'extra property value'
            }, silent).catch(function (error) {
              expect(error.message).toEqual(testErrorMessage);
              expect(error.response).toEqual(testResponseBody);
            });

          case 9:
            expect(_backend.backendLogger.error).not.toHaveBeenCalled();

          case 10:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  })));
});