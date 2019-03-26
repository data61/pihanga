"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
var _exportNames = {
  init: true
};
exports.init = init;

var _table = _interopRequireDefault(require("./table.reducers"));

var _table2 = require("./table.component");

Object.keys(_table2).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  exports[key] = _table2[key];
});

var _table3 = require("./table.actions");

Object.keys(_table3).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  exports[key] = _table3[key];
});

function init(register) {
  (0, _table.default)(register.reducer);
  register.cardComponent({
    name: 'Table',
    component: _table2.TableCardComponent,
    events: {
      onRowSelected: _table3.ACTION_TYPES.ROW_SELECTED,
      onColumnSelected: _table3.ACTION_TYPES.COLUMN_SELECTED,
      clickSortColumn: _table3.ACTION_TYPES.RE_SORT,
      gotoPage: _table3.ACTION_TYPES.GOTO_TABLE_PAGE,
      setRowsPerPage: _table3.ACTION_TYPES.ROWS_PER_TABLE_PAGE
    }
  });
}