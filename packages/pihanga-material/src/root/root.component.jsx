import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { Card } from '@pihanga/core';

import { reloadBackend } from './root.actions';
import theme from './root.theme';

export const RootComponent = (store, routerComponentWrapper) => {
  reloadBackend();

  return (
    <MuiThemeProvider theme={theme()}>
      <Card cardName={'page'} />
    </MuiThemeProvider>
  );
};
