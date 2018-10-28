import { ref } from '../card.service';
import { dispatch, navigateToPage } from 'n1-core';
import { ACTION_TYPES as NAV_DRAWER_ACTION_TYPES } from '../card/nav-drawer/nav-drawer.actions';

function capitalize(s) {
  return s[0].toUpperCase() + s.slice(1);
}

export default {
  page: {
    cardType: 'MyPage',
    title: 'My App',
  
    contentCard: (s) => {
      switch (s.route.routePath) {
        case '/cars' : return 'carListing';
        case '/trucks': return 'truckListing';
        default: return 'unknownListing';
      }
    },

    navDrawerCard: 'navDrawer',
    drawerIsOpen: ref('navDrawer', 'drawerIsOpen'),
    onOpenDrawer: () => () => {
      dispatch({ 
        type: NAV_DRAWER_ACTION_TYPES.OPEN_DRAWER, 
        id: 'navDrawer',
      });
    },
    
    toolbarAddOns: [], 
    showRefreshButton: false, 
    topMargin: true,
    breadcrumbs: (s) => s.route.breadcrumbs,
  },
  navDrawer: {
    cardType: 'NavDrawer',
    drawerIsOpen: true,
    navItems: (s) => {
      return Object.entries(s)
        .filter(e => e[1].topLevel === true)
        .map(e => ({name: capitalize(e[0]), path: e[1].path}))
        ;
    },
    onClickNavMenu: () => ({item}) => {
      navigateToPage(item.path);
    },
  },
  carListing: {
    cardType: 'Table',
    columns: [
      { id: 'id', label: 'ID', numeric: false, sortable: true, isKey: true, },
      { id: 'name', label: 'Name', numeric: false, sortable: true, },
      { id: 'bodyStyle', label: 'Body Style', numeric: false, sortable: true,  },
      { id: 'model', label: 'Model', numeric: false, sortable: true,  },
      { id: 'year', label: 'Year', numeric: true, sortable: true,  },
    ],
    data: s => {
      return s.cars.list
    },
    onRowSelected: () => ({row}) => {
      navigateToPage(`/cars/${row.id}`);    
    },
    onColumnSelected: () => () => {}, // ignore
    path: s => s.cars.path,
    breadcrumbs: [{
      title: 'Cars',
      path: '/cars',
    }],
    //rowsPerPage: 2,
  },
  truckListing: {
    cardType: 'Table',
    columns: [
      { id: 'id', label: 'ID', numeric: false, sortable: true, isKey: true, },
      { id: 'name', label: 'Name', numeric: false, sortable: true, },
      { id: 'model', label: 'Model', numeric: false, sortable: true,  },
      { id: 'year', label: 'Year', numeric: true, sortable: true,  },
    ],
    data: s => {
      return s.trucks.list
    },
    onRowSelected: () => ({row}) => {
      navigateToPage(`/trucks/${row.id}`);    
    },
    onColumnSelected: () => () => {}, // ignore
    path: s => s.trucks.path,
    breadcrumbs: [{
      title: 'Trucks',
      path: '/trucks',
    }],
  },
};
