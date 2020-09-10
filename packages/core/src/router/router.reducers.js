
import { update, dispatchFromReducer } from '../redux';
import { createLogger } from '../logger';

import { ACTION_TYPES as ROUTER_ACTION_TYPES, navigateToPage } from './router.actions';

const logger = createLogger('pihanga:router:reducer');

export default (registerReducer, browserHistory, opts) => {
  const pathPrefix = (opts.pathPrefix || '');
  const pathPrefixLength = pathPrefix.length;

  const toPath = (url) => {
    const sa = url.split('?');
    if (sa.length === 2) {
      // ignoring search
      // const search = sa[1];
    }
    const pa = sa[0].substring(pathPrefixLength).split('/').filter(s => s !== '');
    const q = {};
    const s = sa[1];
    if (s && s.length > 0) {
      s.split('&').forEach((el) => {
        const [k, v] = el.split('=');
        q[decodeURI(k)] = v ? decodeURI(v) : true;
      });
    }
    return [pa, q];
  };

  const toUrl = (path, query = {}) => {
    const url = `${pathPrefix}/${path.join('/')}`;
    const qa = Object.entries(query);
    if (qa.length > 0) {
      const s = qa.map(([k, v]) => `${encodeURI(k)}=${encodeURI(v)}`).join('&');
      return `${url}?${s}`;
    }
    return url;
  };

  opts.currentPath = () => {
    const loc = browserHistory.location;
    const url = loc.pathname + (loc.search || '');
    let [pa, q] = toPath(url);
    if (pa.length === 0 && opts.defPath) {
      const dp = pa = opts.defPath;
      if (Array.isArray(dp)) {
        pa = dp;
      } else {
        pa = dp.split('/').filter(s => s !== '');
      }
    }
    return [pa, q, url];
  };

  registerReducer(ROUTER_ACTION_TYPES.NAVIGATE_TO_PAGE, (state, action) =>  {
    var url = action.url;
    if (pathPrefixLength > 0 && !url.startsWith(pathPrefix)) {
      url = `${pathPrefix}/${url}`;
    }
    if (state.route.url === url) {
      return state;
    }

    const [path, query] = toPath(url);
    dispatchFromReducer({
      type: ROUTER_ACTION_TYPES.SHOW_PAGE,
      path,
      query,
    });
    return update(state, ['route'], {
      fromBrowser: action.fromBrowser,
      path,
      query,
      url,
    });
  });

  registerReducer(ROUTER_ACTION_TYPES.SHOW_PAGE, (state, { path = [], query = {} }) => {
    const url = toUrl(path, query);
    const loc = browserHistory.location;
    const hp = `${loc.pathname}${loc.search}`;
    if (url !== hp) {
      browserHistory.push(url);
    }
    return update(state, ['route'], {
      fromBrowser: false,
      path,
      query,
      url,
    });
  });

  registerReducer('REDUX', 'INIT', (state) => {
    let url;
    if (state.route.path) {
      url = toUrl(state.route.path, state.route.query);
    } else {
      const loc = browserHistory.location;
      const hp = `${loc.pathname}${loc.search}`;
      url = toUrl(...toPath(hp));
    }
    logger.info(`Request navigation to '${url}'`);
    setTimeout(() => navigateToPage(url, true));
    return state;
  });

  browserHistory.listen((location, histAction) => {
    // location is an object like window.location
    const url = `${location.pathname}${location.search}`;
    logger.info('Back in history to: ', url);
    setTimeout(() => navigateToPage(url, histAction === 'POP'));
  });
};
