import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import { RootComponent } from './root.component';

export const ThemedRootComponent = (themeF) => {
  const defTheme = createMuiTheme();
  const t = themeF ? createMuiTheme(themeF(defTheme)) : defTheme;

  return () => {
    return (
      <MuiThemeProvider theme={t}>
        <RootComponent />
      </MuiThemeProvider>
    );
  };
};
