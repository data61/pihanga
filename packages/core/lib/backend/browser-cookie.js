"use strict";

exports.__esModule = true;
exports.getPrefixedCookieName = getPrefixedCookieName;
exports.addCookie = addCookie;
exports.getCookie = getCookie;
exports.removeCookie = removeCookie;
exports.areCookiesEnabled = areCookiesEnabled;
var N1_COOKIE_NAME_PREFIX = 'N1_';
/**
 * @param name
 * @returns {*} A cookie name with N1 prefix if the given name is not empty or undefined
 */

function getPrefixedCookieName(name) {
  if (name && name !== '') {
    return "" + N1_COOKIE_NAME_PREFIX + name;
  }

  return name;
}
/**
 * Create a cookie
 * @param {string} name
 * @param {string} value
 * @param {string} expiryDateStr
 */


function addCookie(name, value, expiryDateStr) {
  var expires = '';

  if (expiryDateStr) {
    expires = "; expires=" + new Date(expiryDateStr).toUTCString();
  }

  document.cookie = getPrefixedCookieName(name) + "=" + value + expires + "; path=/";
}
/**
 * Return the value of a cookie if it is not expired yet
 * @param name
 * @returns {*}
 */


function getCookie(name) {
  var nameEQ = getPrefixedCookieName(name) + "=";

  if (document.cookie) {
    var cookies = document.cookie.split(';');

    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];

      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1, cookie.length);
      }

      if (cookie.indexOf(nameEQ) === 0) return cookie.substring(nameEQ.length, cookie.length);
    }
  }

  return undefined;
}
/**
 * Erase a cookie by setting its expiry date to one day ago
 * @param {string} name
 */


function removeCookie(name) {
  // now
  var tempDate = new Date(); // one day ago

  tempDate.setDate(tempDate.getDate() - 1);
  addCookie(name, '', tempDate);
}
/**
 * Check if cookie is enable
 */


function areCookiesEnabled() {
  var tmpDate = new Date();
  tmpDate.setDate(tmpDate.getDate() + 1);
  var checkCookieName = 'checkCookie';
  var checkCookieValue = 'checkCookieValue';
  addCookie(checkCookieName, checkCookieValue, tmpDate);

  if (getCookie(checkCookieName) === checkCookieValue) {
    removeCookie(checkCookieName);
    return true;
  }

  return false;
}