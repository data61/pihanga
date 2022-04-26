/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { init as materialInit } from '@pihanga/material-ui';
import {
  PiInitF,
  start as pihangaStart,
} from '@pihanga/core';

import AppComponent from './app.component';
import initialReduxState from './app.state';
import initialCards from './app.pihanga';

import { init as cardsInit } from './cards';
import { init as utilsInit } from './utils';
import reportWebVitals from './reportWebVitals';

/**
 * Setup environment for plugins and collect all their init function.
 */
const inits: PiInitF[] = [
  cardsInit,
  utilsInit,
  materialInit,
];

// eslint-disable-next-line no-undef
const rootEl = document.getElementById('root');
const startOpts = {
  // defPath: ['graphs'],
  // pathPrefix: '/dashboard',
  rootEl,
  rootComponent: AppComponent,
  inits,
  initialReduxState,
  initialCards,
};
pihangaStart(startOpts);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
