import { dispatch } from 'n1-core';

const Domain = 'TABLE:';

export const ACTION_TYPES = {
  RE_SORT: `${Domain}RE_SORT`,
  GOTO_TABLE_PAGE: `${Domain}GOTO_TABLE_PAGE`,
  ROWS_PER_TABLE_PAGE: `${Domain}ROWS_PER_TABLE_PAGE`,
  //  NAVIGATE_TO: `${Domain}NAVIGATE_TO`,
};

export function clickSortColumn(tableId, columnId, order, offset, rowsPerPage) {
  dispatch({ 
    type: ACTION_TYPES.RE_SORT, 
    tableId, columnId, order,
    offset, rowsPerPage,
  });
}

export function gotoPage(tableId, offset, rowsPerPage, orderBy, order) {
  dispatch({ type: ACTION_TYPES.GOTO_TABLE_PAGE, tableId, offset, rowsPerPage, orderBy, order });
}

export function setRowsPerPage(tableId, rowsPerPage) {
  dispatch({ type: ACTION_TYPES.ROWS_PER_TABLE_PAGE, tableId, rowsPerPage });
}