
import { start as pihangaStart } from '@pihanga/core';
import { RootComponent } from '@pihanga/material-ui';
import { init as materialInit } from '@pihanga/material-ui';

import initialReduxState from './app.initial-state';
import initialCards from './app.pihanga';
import environment from 'environments/environment';

import { init as spinnerInit } from 'spinner';
import { init as answerInit } from 'answer';
import { init as workflowInit } from 'workflow';

const rootEl = document.getElementById('root');

/**
 * Setup environment for plugins and collect all their init function.
 */
const inits = [
  materialInit, 
  spinnerInit, answerInit, workflowInit,
];

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
