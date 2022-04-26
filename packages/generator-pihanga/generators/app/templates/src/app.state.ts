import { AppState } from './app.type';

const state: AppState = {
  // pihanga: {},
};

if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line global-require
  require('./app.state.debug').default(state);
}

export default state;
