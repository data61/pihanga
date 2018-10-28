import { bootstrap, createLogger } from 'n1-core';
import { AppComponent } from './component';
import { initialState } from './app.initial-state';
import baseCards from './app.pihanga';
import { areCookiesEnabled } from 'n1-core/backend';
import { requireContext } from './require-context';

export { reloadBackend, navigateToPage, createScratch } from './component';

const logger = createLogger('app');

/**
 * Bootstrap the app on given DOM's element Id
 * @param appElementId
 */
export function bootstrapApp(appElementId) {
  if (areCookiesEnabled()) {
    logger.debug('Cookies are enabled in this browser');
  } else {
    logger.warn('Your browser seems to have cookies disabled. We use cookies to improve' +
      ' your experience with our application. Please make sure cookies are enabled.');
  }

  const modules = requireContext();
  bootstrap(appElementId, AppComponent, initialState, modules, baseCards);
}
