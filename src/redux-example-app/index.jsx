import { loadModules } from 'pihanga';
import { AppRouterComponent } from './ui';
import { requireContext } from './require-context';
import { Reducer } from './redux';

/**
 * Bootstrap the app on given DOM's element Id
 * @param appElementId
 */
export function bootstrapApp(appElementId) {
  const reducer = new Reducer({});

  const routerComponentWrapper = loadModules(
    process.env.REACT_APP_LOG_LEVEL,
    requireContext(),
    [reducer.registerReducer.bind(reducer)],
  );

  const RouterComponent = AppRouterComponent(routerComponentWrapper);
  const store = createStore(reducer.rootReducer.bind(reducer), initialState);

  ReactDOM.render(
    <Provider store={store}>
      <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
        <RouterComponent />
      </MuiThemeProvider>
    </Provider>,
    document.getElementById(appElementId),
  );
}
