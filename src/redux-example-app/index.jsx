import React from 'react';
import ReactDOM from 'react-dom';
import { compose, withProps } from 'recompose';
import { Provider, connect } from 'react-redux';
import { loadModules } from 'pihanga';

import { AppRouterComponent, initialState } from './ui';
import { requireContext } from './require-context';
import { Reducer, update, createStore } from './redux';
import { updateRoute, ACTION_TYPES } from './root.actions';
/**
 * Bootstrap the app on given DOM's element Id
 * @param appElementId
 */
export function bootstrapApp(appElementId) {
  const reducer = new Reducer({});
  reducer.registerReducer(
    ACTION_TYPES.UPDATE_ROUTE,
    (state, { path, payload, preventAddingHistory }) =>
      update(state, [], {
        route: { path, payload, preventAddingHistory }
      })
  );

  const routerComponentWrapper = loadModules(process.env.REACT_APP_LOG_LEVEL, requireContext(), [
    reducer.registerReducer.bind(reducer)
  ]);

  const RouterComponent = connect(s => s)(
    compose(
      withProps({
        updateRoute
      })
    )(AppRouterComponent(routerComponentWrapper))
  );

  const store = createStore(reducer.rootReducer.bind(reducer), initialState);

  ReactDOM.render(
    <Provider store={store}>
      <RouterComponent />
    </Provider>,
    document.getElementById(appElementId)
  );
}
