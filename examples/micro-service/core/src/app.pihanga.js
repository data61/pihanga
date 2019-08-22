import { ref } from '@pihanga/core';
import { dispatch, navigateToPage, actions } from '@pihanga/core';
import { pQuery } from '@pihanga/core';
import flow from 'lodash.flow';

// fp version of 'map'
const mapF = (f) => (a) => a.map(f);

/**
 * Return true if the first element in the current path equals `topSel`
 * and if it has `levels`.
 * 
 * For instance `routeSel('node', 2)` will return true for a route
 * `/node/someNode`, but false for `/node`.
 * 
 * @param {string} topSel 
 * @param {number} levels 
 */
export const routeSel = (topSel, levels = 1) => s => {
  const path = s.route.path;
  return path.length === levels && path[0] === topSel;
};

/**
 * Return the entity ID for the current page. 
 * 
 * The entity ID is supposed to be the second element in the 
 * path array. For instance a route of `/node/someNode` will
 * return `someNode`.
 * 
 * @param {state} s 
 */
export const entityID = s => {
  return s.route.path[1];
}

export default {
  page: {
    cardType: 'PageD1',
    title: 'Cool Corp',
    subTitle: (s, ref) => {
      const c = ref('page', 'contentCard');
      const title = ref(c, 'title');
      return title;
    },
    contentCard: flow(
        pQuery(null, 'isRouteSelected', true),
        (a) => a.length === 1 ? a[0].cardName : 'overview'
    ),

    navDrawerCard: 'navDrawer',
    drawerIsOpen: ref('navDrawer', 'drawerIsOpen'),
    onOpenDrawer: () => () => {  // redirect open drawer action to 'navDrawer'
      dispatch({ 
        type: actions('PiNavDrawer').OPEN_DRAWER, 
        id: 'navDrawer',
      });
    },
    
    toolbarAddOns: [], 
    showRefreshButton: false, 
    topMargin: true,
    breadcrumbs: (s) => s.route.breadcrumbs,
  },
  navDrawer: {
    cardType: 'PiNavDrawer',
    drawerIsOpen: true,
    navItems: flow(
      pQuery(null, 'isTopLevel', true, ['title', 'path']),
      mapF(e => ({name: e.params.title, path: e.params.path}))
    ),
    onClickNavMenu: () => ({item}) => {
      navigateToPage(item.path);
    },
  },

  overview: {
    cardType: 'MuiCard',
    title: 'Overview',
    isTopLevel: true,
    path: '/overview',
    isRouteSelected: routeSel('overview'),
    //  subTitle: 'Kind of',
    //titleAvatar: 'O',
    content: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur rhoncus quam ex, sagittis pharetra eros aliquam gravida. Vivamus at ipsum eget erat aliquam consectetur. Etiam id lorem ac orci volutpat aliquet. ',
      'Nulla congue aliquam libero, sed dignissim risus egestas id. Curabitur ultrices sapien quis sapien aliquam, eget pretium dui porttitor. '],
    //mui: {titleAvatar: {color: 'primary'}}
    //grid: {xs: 12, sm: 6},
  },
};
