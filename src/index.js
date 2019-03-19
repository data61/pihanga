import { bootstrapApp as bootstrapAppWithApolloClient } from './apollo-client-example-app';
import { bootstrapApp as bootstrapAppWithRedux } from './redux-example-app';

import * as serviceWorker from './serviceWorker';

// bootstrap the app on given DOM's element ID in {@link ../public/index.html}
if (process.env.DEMO_APOLLO_CLIENT_EXAMPLE) {
  bootstrapAppWithApolloClient('root');
} else {
  bootstrapAppWithRedux('root');
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
