
import { start as pihangaStart, createLogger, exportModule } from '@pihanga/core';
import { RootComponent } from '@pihanga/material-ui';
import { init as materialInit } from '@pihanga/material-ui';

import initialReduxState from './app.initial-state';
import initialCards from './app.pihanga';
import environment from 'environments/environment';

const logger = createLogger('micro-service:init');
const rootEl = document.getElementById('root');

/**
 * Setup environment for plugins and collect all their init function.
 */
const inits = [materialInit];

// Populate rendezvous point for extensions
if (window.Pihanga) {
  exportModule(window.Pihanga.Core, require('@pihanga/core'));
  exportModule(window.Pihanga.UI, require('@pihanga/material-ui'));
  if (Array.isArray(window.Pihanga.BootstrapInit)) {
    const opts = exportModule({}, require('./app.pihanga'));
    window.Pihanga.BootstrapInit.forEach(f => {
      const initF = f(opts);
      if (initF) {
        inits.push(initF);
      } else {
        logger.error("extension bootstrap didn't return anything for ", f);
      }
    });
  }
}

pihangaStart({
  // defPath: ['graphs'],
  // pathPrefix: '/dashboard',
  rootEl,
  rootComponent: RootComponent,
  inits,
  initialReduxState,
  initialCards,
  environment,
});
