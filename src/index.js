import { bootstrapApp } from './apollo-client-example-app';
import * as serviceWorker from './serviceWorker';

// bootstrap the app on given DOM's element ID in {@link ../public/index.html}
bootstrapApp('root');

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
