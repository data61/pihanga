"use strict";

var _browserCookie = require("./browser-cookie");

describe('Cookie', function () {
  describe('addCookie()', function () {
    it('should add cookie', function () {
      var testCookieName = 'testCookieName';
      var testCookieValue = '123';
      var testDate = new Date();
      (0, _browserCookie.addCookie)(testCookieName, testCookieValue, testDate.toString());
      expect(document.cookie.indexOf((0, _browserCookie.getPrefixedCookieName)(testCookieName) + "=" + testCookieValue) > -1).toBeTruthy();
      expect(document.cookie.indexOf("expires=" + testDate.toUTCString()) > -1).toBeTruthy();
      expect(document.cookie.indexOf('path=/') > -1).toBeTruthy();
    });
    it('should deal with undefined/empty value', function () {
      var testDate = new Date();
      (0, _browserCookie.addCookie)(undefined, 123, testDate.toString());
      expect(document.cookie.indexOf('=123') > -1).toBeTruthy();
      (0, _browserCookie.addCookie)('', 123, testDate.toString());
      expect(document.cookie.indexOf('=123') > -1).toBeTruthy();
      (0, _browserCookie.addCookie)('testEmptyValue', '', testDate.toString());
      expect(document.cookie.indexOf((0, _browserCookie.getPrefixedCookieName)('testEmptyValue') + "=;") > -1).toBeTruthy();
      (0, _browserCookie.addCookie)('testEmptyValue', undefined, testDate.toString());
      expect(document.cookie.indexOf((0, _browserCookie.getPrefixedCookieName)('testEmptyValue') + "=undefined;") > -1).toBeTruthy();
    });
  });
  describe('getCookie()', function () {
    it('should get cookie correctly', function () {
      var testCookieName = 'testCookieName';
      var testCookieValue = '987';
      document.cookie = (0, _browserCookie.getPrefixedCookieName)(testCookieName) + "=" + testCookieValue + ";";
      expect((0, _browserCookie.getCookie)(testCookieName)).toEqual(testCookieValue);
    });
    it('should deal with undefined value', function () {
      var testCookieName = undefined;
      var testCookieValue = '987';
      document.cookie = (0, _browserCookie.getPrefixedCookieName)(testCookieName) + "=" + testCookieValue + ";";
      expect((0, _browserCookie.getCookie)(testCookieName)).toEqual(testCookieValue);
    });
    it('should deal with empty value', function () {
      var testCookieName = '';
      var testCookieValue = '123';
      document.cookie = (0, _browserCookie.getPrefixedCookieName)(testCookieName) + "=" + testCookieValue + ";";
      expect((0, _browserCookie.getCookie)(testCookieName)).toEqual(testCookieValue);
    });
  });
  describe('getCookie()', function () {
    // NOTE: To be safe, expiryDate should be compared to the date before calling
    // removeCookie() not right now, because after calling removeCookie(), it can be unexpected
    // when browser will check for
    // cookie's expiry date
    function checkExpiryDate(againstDate) {
      // extract expiry date
      var expiryDate = new Date(document.cookie.split(';').filter(function (part) {
        return part.indexOf('expires=') > -1;
      })[0].trim().split('=')[1]);
      expect(expiryDate < againstDate).toBeTruthy();
    }

    var beforeRemoveCookieDate;
    beforeEach(function () {
      beforeRemoveCookieDate = new Date();
    });
    it('should remove cookie', function () {
      var testCookieName = 'testCookieName';
      (0, _browserCookie.removeCookie)(testCookieName);
      checkExpiryDate(beforeRemoveCookieDate);
      expect(document.cookie.indexOf(testCookieName + "=; "));
    });
    it('should deal with undefined value', function () {
      var testCookieName = undefined;
      (0, _browserCookie.removeCookie)(testCookieName);
      checkExpiryDate(beforeRemoveCookieDate);
    });
    it('should deal with empty value', function () {
      var testCookieName = '';
      (0, _browserCookie.removeCookie)(testCookieName);
      checkExpiryDate(beforeRemoveCookieDate);
    });
  });
  it('should check if cookies are enabled', function () {
    expect((0, _browserCookie.areCookiesEnabled)()).toBeTruthy(); // force the mock cookie to be disabled

    document.enableCookie(false);
    expect((0, _browserCookie.areCookiesEnabled)()).toBeFalsy();
  });
});