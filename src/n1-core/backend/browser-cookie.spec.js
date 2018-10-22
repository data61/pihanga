import { addCookie, getCookie, removeCookie, areCookiesEnabled, getPrefixedCookieName } from './browser-cookie';

describe('Cookie', () => {
  describe('addCookie()', () => {
    it('should add cookie', () => {
      const testCookieName = 'testCookieName';
      const testCookieValue = '123';
      const testDate = new Date();
      addCookie(testCookieName, testCookieValue, testDate.toString());

      expect(document.cookie.indexOf(`${getPrefixedCookieName(testCookieName)}=${testCookieValue}`) > -1).toBeTruthy();
      expect(document.cookie.indexOf(`expires=${testDate.toUTCString()}`) > -1).toBeTruthy();
      expect(document.cookie.indexOf('path=/') > -1).toBeTruthy();
    });

    it('should deal with undefined/empty value', () => {
      const testDate = new Date();

      addCookie(undefined, 123, testDate.toString());
      expect(document.cookie.indexOf('=123') > -1).toBeTruthy();

      addCookie('', 123, testDate.toString());
      expect(document.cookie.indexOf('=123') > -1).toBeTruthy();

      addCookie('testEmptyValue', '', testDate.toString());
      expect(document.cookie.indexOf(`${getPrefixedCookieName('testEmptyValue')}=;`) > -1).toBeTruthy();

      addCookie('testEmptyValue', undefined, testDate.toString());
      expect(document.cookie.indexOf(`${getPrefixedCookieName('testEmptyValue')}=undefined;`) > -1).toBeTruthy();
    });
  });

  describe('getCookie()', () => {
    it('should get cookie correctly', () => {
      const testCookieName = 'testCookieName';
      const testCookieValue = '987';

      document.cookie = `${getPrefixedCookieName(testCookieName)}=${testCookieValue};`;
      expect(getCookie(testCookieName)).toEqual(testCookieValue);
    });

    it('should deal with undefined value', () => {
      let testCookieName = undefined;
      const testCookieValue = '987';

      document.cookie = `${getPrefixedCookieName(testCookieName)}=${testCookieValue};`;
      expect(getCookie(testCookieName)).toEqual(testCookieValue);
    });

    it('should deal with empty value', () => {
      let testCookieName = '';
      const testCookieValue = '123';

      document.cookie = `${getPrefixedCookieName(testCookieName)}=${testCookieValue};`;
      expect(getCookie(testCookieName)).toEqual(testCookieValue);
    });
  });

  describe('getCookie()', () => {
    // NOTE: To be safe, expiryDate should be compared to the date before calling
    // removeCookie() not right now, because after calling removeCookie(), it can be unexpected
    // when browser will check for
    // cookie's expiry date
    function checkExpiryDate(againstDate) {
      // extract expiry date
      const expiryDate = new Date(document.cookie
        .split(';')
        .filter((part) => (part.indexOf('expires=') > -1))[0]
        .trim()
        .split('=')[1]);

      expect(expiryDate < againstDate).toBeTruthy();
    }

    let beforeRemoveCookieDate;
    beforeEach(() => {
      beforeRemoveCookieDate = new Date();
    });

    it('should remove cookie', () => {
      const testCookieName = 'testCookieName';
      removeCookie(testCookieName);
      checkExpiryDate(beforeRemoveCookieDate);
      expect(document.cookie.indexOf(`${testCookieName}=; `))
    });

    it('should deal with undefined value', () => {
      const testCookieName = undefined;
      removeCookie(testCookieName);
      checkExpiryDate(beforeRemoveCookieDate);
    });

    it('should deal with empty value', () => {
      const testCookieName = '';
      removeCookie(testCookieName);
      checkExpiryDate(beforeRemoveCookieDate);
    });
  });

  it('should check if cookies are enabled', () => {
    expect(areCookiesEnabled()).toBeTruthy();

    // force the mock cookie to be disabled
    document.enableCookie(false);
    expect(areCookiesEnabled()).toBeFalsy();
  });
});
