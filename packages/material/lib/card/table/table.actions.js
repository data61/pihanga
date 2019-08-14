"use strict";

exports.__esModule = true;
exports.clickSortColumn = clickSortColumn;
exports.gotoPage = gotoPage;
exports.setRowsPerPage = setRowsPerPage;
exports.ACTION_TYPES = void 0;

var _core = require("@pihanga/core");

var Domain = 'TABLE:';
var ACTION_TYPES = {
  ROW_SELECTED: Domain + "ROW_SELECTED",
  COLUMN_SELECTED: Domain + "COLUMN_SELECTED",
  RE_SORT: Domain + "RE_SORT",
  GOTO_TABLE_PAGE: Domain + "GOTO_TABLE_PAGE",
  ROWS_PER_TABLE_PAGE: Domain + "ROWS_PER_TABLE_PAGE" //  NAVIGATE_TO: `${Domain}NAVIGATE_TO`,

};
exports.ACTION_TYPES = ACTION_TYPES;

function clickSortColumn(tableId, columnId, order, offset, rowsPerPage) {
  (0, _core.dispatch)({
    type: ACTION_TYPES.RE_SORT,
    tableId: tableId,
    columnId: columnId,
    order: order,
    offset: offset,
    rowsPerPage: rowsPerPage
  });
}

function gotoPage(tableId, offset, rowsPerPage, orderBy, order) {
  (0, _core.dispatch)({
    type: ACTION_TYPES.GOTO_TABLE_PAGE,
    tableId: tableId,
    offset: offset,
    rowsPerPage: rowsPerPage,
    orderBy: orderBy,
    order: order
  });
}

function setRowsPerPage(tableId, rowsPerPage) {
  (0, _core.dispatch)({
    type: ACTION_TYPES.ROWS_PER_TABLE_PAGE,
    tableId: tableId,
    rowsPerPage: rowsPerPage
  });
}