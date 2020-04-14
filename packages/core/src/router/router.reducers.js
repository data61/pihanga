
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
    return pa;
  }

  const toUrl = (path) => {
    const url = `${pathPrefix}/${path.join('/')}`;
    return url;
  }

  opts.currentPath = () => {
    var pa = toPath(browserHistory.location.pathname);
    if (pa.length === 0 && opts.defPath) {
      const dp = pa = opts.defPath;
      if (Array.isArray(dp)) {
        pa = dp;
      } else {
        pa = dp.split('/').filter(s => s !== '');
      }
    }
    return pa;
  }

  registerReducer(ROUTER_ACTION_TYPES.NAVIGATE_TO_PAGE, (state, action) =>  {
    var url = action.url;
    if (pathPrefixLength > 0 && !url.startsWith(pathPrefix)) {
      url = `${pathPrefix}/${url}`;
    }
    if (state.route.url === url) {
      return state;
    }

    const pa = toPath(url);
    dispatchFromReducer({
      type: ROUTER_ACTION_TYPES.SHOW_PAGE,
      path: pa,
    });
    return update(state, ['route'], {
      fromBrowser: action.fromBrowser,
      path: pa,
      url
    })
  });

  registerReducer(ROUTER_ACTION_TYPES.SHOW_PAGE, (state, action) =>  {
    const cp = toUrl(action.path);
    const hp = browserHistory.location.pathname;
    if (cp !== hp) {
      browserHistory.push(cp);
    }
    return state;
  });

  registerReducer('REDUX', 'INIT', (state) => {
    const cp = toUrl(state.route.path);
    logger.info(`Request navigation to '${cp}'`);
    setTimeout(() => navigateToPage(cp, true));
    return state;
  });

  browserHistory.listen((location, action) => {
    // location is an object like window.location
    logger.info("Back in history to", location.pathname);
    setTimeout(() => navigateToPage(location.pathname, true));
  });

}
