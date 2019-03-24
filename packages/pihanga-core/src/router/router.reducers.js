import isFunction from 'lodash/isFunction';

import { update, dispatch } from '../redux';
//import environment from 'environments/environment';
const environment = {
  PATH_PREFIX: null
};

import {  ACTION_TYPES as ROUTER_ACTION_TYPES } from './router.actions';

const pathPrefix = (environment.PATH_PREFIX || '');
const pathPrefixLength = pathPrefix.length;

export default (registerReducer, getRoute) => {

  registerReducer(ROUTER_ACTION_TYPES.NAVIGATE_TO_PAGE, (state, action) =>  {
    const path = action.path;
    if (state.route.routePath === path) {
      return state;
    }

    const pa = path.substring(pathPrefixLength).split('/');
    const breadcrumbs = pa.slice(1).map((x, i) => {
      const p = pathPrefix + pa.slice(0, i + 2).join('/');
      //const r = RouterService.findComponentAndExtractParams(routingConfig, p);
      const r = getRoute(p);
      const routeParam = (r && r.routeParamValueByName) ? r.routeParamValueByName : {};
      const title = r.title ? (isFunction(r.title) ? r.title(routeParam) : r.title) : 'Unknown';
      const showInBreadcrumb = !(r.breadcrumb === false);
      return {
        routePath: p,
        routeParam,
        pageType: r.type || 'unknown',
        title,
        showInBreadcrumb,
      }
    })
    const r = breadcrumbs[breadcrumbs.length - 1];
    setTimeout(() => dispatch({
      type: ROUTER_ACTION_TYPES.SHOW_PAGE,
      ...r
    }));
    return update(state, ['route'], {
      ...r,
      fromBrowser: action.fromBrowser,
      breadcrumbs,
    })
  });
}