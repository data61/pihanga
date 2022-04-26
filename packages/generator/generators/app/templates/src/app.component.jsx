import React from 'react';
import { Card } from '@pihanga/core';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './app.theme';

const App  = () => {
  return (
    <ThemeProvider theme={theme}>
      <Card cardName="page" />
    </ThemeProvider>
  );
};

export default App;