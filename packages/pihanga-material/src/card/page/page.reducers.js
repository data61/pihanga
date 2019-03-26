import update from 'immutability-helper';

import { ACTION_TYPES as PAGE_ACTION_TYPES } from './page.actions';
import {  ROUTER_ACTION_TYPES } from '@pihanga/core';

export default (registerReducer) => {

  registerReducer(ROUTER_ACTION_TYPES.SHOW_PAGE, (state, action) => {
    const bc = state.route.breadcrumbs
    .slice(0, state.route.breadcrumbs.length - 1)
    .filter(b => b.showInBreadcrumb)
    .map(e => ({
      title: e.title,
      path: e.routePath,
    }));
    //const last = bc.pop();
    return update(ensurePage(state), {
      page: { 
        subTitle: { $set: state.route.title },
        breadcrumbs: { $set: bc } 
      }
    });
  });


  registerReducer(PAGE_ACTION_TYPES.OPEN_DRAWER, (state, action) => {
    return drawerState(state, true);
  });

  registerReducer(PAGE_ACTION_TYPES.CLOSE_DRAWER, (state, action) => {
    return drawerState(state, false, action.cardName);
  })

  function drawerState(state, isOpen, cardName) {
    return update(ensurePage(state), {
      page: { drawerOpen: { $set: isOpen } }
    });
  }

  function ensurePage(state) {
    if (state.page) return state;
    return update(state, {
      page: { $set: {} },
    });
  }

  registerReducer(PAGE_ACTION_TYPES.TOGGLE_USER_MENU, (state, action) => {
    return update(ensurePage(state), {
        page: {
          userMenu: {
            $set: {
              isOpen: action.isOpen,
            },
          },
        },
    });
  });

  registerReducer(PAGE_ACTION_TYPES.TOGGLE_VERSION_INFO, (state, action) => {
    return update(ensurePage(state), {
      scratch: {
        versionInfo: {
          $set: {
            isOpen: action.isOpen,
            anchorEl: action.anchorEl,
          },
        },
      },
    });
  });
}
