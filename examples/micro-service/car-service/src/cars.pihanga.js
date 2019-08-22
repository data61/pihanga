import { navigateToPage } from '@pihanga/core';

export default function(opts) {
  const { routeSel } = opts;
  return {
    carListing: {
      cardType: 'PiTable',
      title: 'Available Cars',
      isTopLevel: true,
      path: '/cars',
      isRouteSelected: routeSel('cars'),
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
      breadcrumbs: [{
        title: 'Cars',
        path: '/cars',
      }],
      //rowsPerPage: 2,
      onRowSelected: () => ({row}) => {
        navigateToPage(`/cars/${row.id}`);    
      },
      onColumnSelected: () => () => {}, // ignore
    },
  };
};