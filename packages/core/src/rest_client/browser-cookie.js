const N1_COOKIE_NAME_PREFIX = 'N1_';

/**
 * @param name
 * @returns {*} A cookie name with N1 prefix if the given name is not empty or undefined
 */
export function getPrefixedCookieName(name) {
  if (name && name !== '') {
    return `${N1_COOKIE_NAME_PREFIX}${name}`;
  }

  return name;
}

/**
 * Create a cookie
 * @param {string} name
 * @param {string} value
 * @param {string} expiryDateStr
 */
export function addCookie(name, value, expiryDateStr) {
  let expires = '';

  if (expiryDateStr) {
    expires = `; expires=${new Date(expiryDateStr).toUTCString()}`;
  }

  document.cookie = `${getPrefixedCookieName(name)}=${value}${expires}; path=/`;
}

/**
 * Return the value of a cookie if it is not expired yet
 * @param name
 * @returns {*}
 */
export function getCookie(name) {
  const nameEQ = `${getPrefixedCookieName(name)}=`;

  if (document.cookie) {
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      while (cookie.charAt(0) === ' ') cookie = cookie.substring(1, cookie.length);
      if (cookie.indexOf(nameEQ) === 0) return cookie.substring(nameEQ.length, cookie.length);
    }
  }

  return undefined;
}

/**
 * Erase a cookie by setting its expiry date to one day ago
 * @param {string} name
 */
export function removeCookie(name) {
  // now
  const tempDate = new Date();

  // one day ago
  tempDate.setDate(tempDate.getDate() - 1);

  addCookie(name, '', tempDate);
}

/**
 * Check if cookie is enable
 */
export function areCookiesEnabled() {
  const tmpDate = new Date();
  tmpDate.setDate(tmpDate.getDate() + 1);

  const checkCookieName = 'checkCookie';
  const checkCookieValue = 'checkCookieValue';

  addCookie(checkCookieName, checkCookieValue, tmpDate);
  if (getCookie(checkCookieName) === checkCookieValue) {
    removeCookie(checkCookieName);
    return true;
  }

  return false;
}
