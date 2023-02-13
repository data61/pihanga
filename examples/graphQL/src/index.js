
import { start as pihangaStart } from '@pihanga/core';
import { RootComponent } from '@pihanga/material-ui';
import { init as materialInit } from '@pihanga/material-ui';
import { init as graphqlInit } from '@pihanga/graphql';

import initialReduxState from './app.initial-state';
import initialCards from './app.pihanga';
import environment from 'environments/environment';

import { init as networkInit } from './network';
import { init as queryInit } from './app.queries';
import { init as reducerInit } from './app.reducers';

const rootEl = document.getElementById('root');

/**
 * Setup environment for plugins and collect all their init function.
 */
const inits = [
  materialInit, 
  graphqlInit,

  networkInit,
  queryInit,
  reducerInit,
];

pihangaStart({
  rootEl,
  rootComponent: RootComponent,
  inits,
  initialReduxState,
  initialCards,
  environment,
});
