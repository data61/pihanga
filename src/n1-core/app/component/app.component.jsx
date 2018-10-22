import React from 'react';
import { Provider, connect } from 'react-redux';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
//import { card } from '../../card.service';
import { Card } from 'n1-core';

import { reloadBackend } from './app.actions';
import theme from './app.theme';

const AppComponent = (store, routerComponentWrapper) => {
  const loadingRouteElement = (
    <div>
      LOADING
    </div>
  );

  const routeNotFoundElementFunc = invalidRoutePath => (
    <div>
      <p>ERROR: Path &quot;{invalidRoutePath}&quot; does not exist. Please check your URL.</p>
    </div>
  );

  const N1RouterComponent = connect(s => s)(
    routerComponentWrapper
      .customise(
        loadingRouteElement,
        routeNotFoundElementFunc,
      )
      .getRouterComponentConstructor(),
  );

  // PIHANAGA

  const cardNotFoundFunc = missingCard => (
    <div>
      <p>ERROR: Can't find card  &quot;{missingCard}&quot;. Please check your configuration.</p>
    </div>
  );

  // const PageComponent = connect(s => s)(s => {
  //   const page = s.pihanga.page;
  //   if (!page) {
  //     return cardNotFoundFunc("page");
  //   }
  //   const cardComponent = card(page.cardType);
  //   const state = Object.assign({}, s, {card: page, cardName: 'page'})
  //   const el = React.createElement(cardComponent, state);
  //   return el;
  // });

  reloadBackend();

  // return (
  //   <Provider store={store}>
  //     <MuiThemeProvider theme={theme()}>
  //       <N1RouterComponent />
  //     </MuiThemeProvider>
  //   </Provider>
  // );
  return (
    <Provider store={store}>
      <MuiThemeProvider theme={theme()}>
        <Card cardName={'page'} />
      </MuiThemeProvider>
    </Provider>
  );
};

export default AppComponent;
