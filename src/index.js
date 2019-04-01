import { bootstrapApp as bootstrapAppWithApolloClient } from './examples/apollo-client-example-app';
import { bootstrapApp as bootstrapAppWithRedux } from './examples/redux-example-app';
import * as serviceWorker from './examples/serviceWorker';

// bootstrap the app on given DOM's element ID in {@link ../public/index.html}
if (process.env.REACT_APP_USE_REDUX === 'true') {
  bootstrapAppWithRedux('root');
} else {
  bootstrapAppWithApolloClient('root');
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
