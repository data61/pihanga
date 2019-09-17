
import { start as pihangaStart } from '@pihanga/core';
import { RootComponent } from '@pihanga/material-ui';
import { init as materialInit } from '@pihanga/material-ui';
import { init as rechartsInit } from '@pihanga/recharts';

import initialReduxState from './app.initial-state';
import initialCards, { init as metaInit } from './app.pihanga';
import environment from 'environments/environment';
import { init as backendInit } from './backend';

// import { init as restInit } from 'rest_client';

const rootEl = document.getElementById('root');

/**
 * Setup environment for plugins and collect all their init function.
 */
const inits = [
  // restInit,
  materialInit, 
  rechartsInit,
  backendInit,
  metaInit,
];

pihangaStart({
  rootEl,
  rootComponent: RootComponent,
  inits,
  initialReduxState,
  initialCards,
  environment,
});
