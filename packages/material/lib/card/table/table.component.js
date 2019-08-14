"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.TableCardComponent = exports.DEF_ROWS_PER_PAGE = void 0;

var _react = _interopRequireDefault(require("react"));

var _sortBy = _interopRequireDefault(require("lodash/sortBy"));

var _classnames = _interopRequireDefault(require("classnames"));

var _Table = _interopRequireDefault(require("@material-ui/core/Table"));

var _TableBody = _interopRequireDefault(require("@material-ui/core/TableBody"));

var _TableCell = _interopRequireDefault(require("@material-ui/core/TableCell"));

var _TableHead = _interopRequireDefault(require("@material-ui/core/TableHead"));

var _TableRow = _interopRequireDefault(require("@material-ui/core/TableRow"));

var _TableSortLabel = _interopRequireDefault(require("@material-ui/core/TableSortLabel"));

var _TableFooter = _interopRequireDefault(require("@material-ui/core/TableFooter"));

var _TablePagination = _interopRequireDefault(require("@material-ui/core/TablePagination"));

var _Paper = _interopRequireDefault(require("@material-ui/core/Paper"));

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _core = require("@pihanga/core");

var _link = require("../../component/link");

var _table = _interopRequireDefault(require("./table.style"));

var DEF_ROWS_PER_PAGE = [10, 25, 100];
exports.DEF_ROWS_PER_PAGE = DEF_ROWS_PER_PAGE;
var TableCardComponent = (0, _table.default)(function (_ref) {
  var data = _ref.data,
      columns = _ref.columns,
      orderBy = _ref.orderBy,
      _ref$orderDir = _ref.orderDir,
      orderDir = _ref$orderDir === void 0 ? 'asc' : _ref$orderDir,
      onRowSelected = _ref.onRowSelected,
      onColumnSelected = _ref.onColumnSelected,
      clickSortColumn = _ref.clickSortColumn,
      gotoPage = _ref.gotoPage,
      setRowsPerPage = _ref.setRowsPerPage,
      _ref$dataOffset = _ref.dataOffset,
      dataOffset = _ref$dataOffset === void 0 ? 0 : _ref$dataOffset,
      title = _ref.title,
      _ref$showHeader = _ref.showHeader,
      showHeader = _ref$showHeader === void 0 ? true : _ref$showHeader,
      _ref$rowsPerPage = _ref.rowsPerPage,
      rowsPerPage = _ref$rowsPerPage === void 0 ? DEF_ROWS_PER_PAGE[0] : _ref$rowsPerPage,
      _ref$rowsPerPageOptio = _ref.rowsPerPageOptions,
      rowsPerPageOptions = _ref$rowsPerPageOptio === void 0 ? DEF_ROWS_PER_PAGE : _ref$rowsPerPageOptio,
      classes = _ref.classes;
  var rows = data;
  var dataSize = data.length;

  if (!orderBy) {
    // find first sortable one as default
    orderBy = columns.find(function (c) {
      return c.sortable;
    });
  }

  if (orderBy) {
    rows = (0, _sortBy.default)(rows, [orderBy]);

    if (orderDir === 'desc') {
      rows = rows.reverse();
    }
  }

  rows = rows.slice(dataOffset, rowsPerPage);
  var showFooter = dataSize !== rows.length;

  var onSortingChange = function onSortingChange(column) {
    var order = 'asc';

    if (orderBy === column.id) {
      order = orderDir === 'asc' ? 'desc' : 'asc';
    }

    clickSortColumn({
      orderBy: column.id,
      orderDir: order
    });
  }; // TODO: A bit of a hack to further customize column cells. 
  // Need to find cleaner solution


  var colCellClasses = {};
  columns.map(function (c) {
    var p = c.padding || 'default';
    var sn = 'tableCell_' + p;
    var ov = [];
    if (classes[sn]) ov.push(classes[sn]);

    if (c.fill === true) {
      ov.push(classes.tableCell_fill);
    }

    colCellClasses[c.id] = ov.length > 0 ? _classnames.default.apply(void 0, ov.concat([classes.tableCell])) : classes.tableCell;
    return c;
  });

  var renderTitle = function renderTitle() {
    if (title) {
      return _react.default.createElement(_Typography.default, {
        type: "headline",
        component: "h3",
        className: classes.title
      }, title);
    }
  };

  var renderHeaderCells = function renderHeaderCells() {
    return columns.filter(function (c) {
      return c.visible === undefined || c.visible === true;
    }).map(function (column) {
      return _react.default.createElement(_TableCell.default, {
        key: column.id,
        align: column.align | column.numeric ? 'right' : 'left',
        padding: column.padding || 'default',
        className: colCellClasses[column.id]
      }, _react.default.createElement(_TableSortLabel.default, {
        active: orderBy === column.id,
        direction: orderDir,
        onClick: function onClick() {
          return onSortingChange(column);
        }
      }, column.label));
    });
  };

  var renderHeader = function renderHeader() {
    if (showHeader) {
      return _react.default.createElement(_TableHead.default, null, _react.default.createElement(_TableRow.default, {
        className: classes.table_head_row
      }, renderHeaderCells()));
    }
  };

  var renderColumnValue = function renderColumnValue(row, column) {
    if (column.value) {
      return column.value(row);
    }

    var v = row[column.id];

    if (isNaN(v) && typeof v !== 'string') {
      v = _react.default.createElement("pre", null, JSON.stringify(v, null, 2));
    }

    if (column.onSelect) {
      return _react.default.createElement(_link.LinkComponent, {
        onClick: function onClick() {
          return column.onSelect(row);
        }
      }, v);
    } else {
      return v;
    }
  };

  var renderRows = function renderRows() {
    var keyCol = (columns.find(function (c) {
      return c.isKey === true;
    }) || columns[0]).id;
    return rows.map(function (row) {
      var key = row[keyCol];
      return _react.default.createElement(_TableRow.default, {
        hover: true,
        onClick: function onClick() {
          if (onRowSelected) onRowSelected({
            row: row
          });
        },
        key: key
      }, columns.filter(function (c) {
        return c.visible === undefined || c.visible === true;
      }).map(function (column) {
        var value = renderColumnValue(row, column);
        var cn = colCellClasses[column.id]; // classes.tableCell

        return _react.default.createElement(_TableCell.default, {
          key: column.id,
          align: column.align | column.numeric ? 'right' : 'left',
          padding: column.padding || 'default',
          onClick: function onClick() {
            if (onColumnSelected) onColumnSelected({
              value: value,
              column: column,
              row: row
            });
          },
          className: cn
        }, value);
      }));
    });
  };

  function onChangePage(ev, page) {
    var o = page * rowsPerPage;
    var offset = o < 0 ? 0 : o;

    if (offset === dataOffset) {
      // same value, ignore
      return;
    }

    gotoPage({
      offset: offset,
      rowsPerPage: rowsPerPage,
      orderBy: orderBy,
      orderDir: orderDir
    });
  }

  function onChangeRowsPerPage(evt) {
    var t = evt.target;
    var rpp = t.value;

    if (rpp === rowsPerPage) {
      // same value, igonore
      return;
    }

    setRowsPerPage({
      rowsPerPage: rpp
    });
    gotoPage({
      dataOffset: dataOffset,
      rowsPerPage: rpp,
      orderBy: orderBy,
      orderDir: orderDir
    });
  }

  var renderFooter = function renderFooter() {
    if (!showFooter) return;
    var page = Math.round(dataOffset / rowsPerPage);
    return _react.default.createElement(_TableFooter.default, null, _react.default.createElement("tr", null, _react.default.createElement(_TablePagination.default, {
      count: dataSize,
      rowsPerPage: rowsPerPage || 10,
      page: page,
      onChangePage: onChangePage,
      onChangeRowsPerPage: onChangeRowsPerPage,
      rowsPerPageOptions: rowsPerPageOptions
    })));
  };

  return _react.default.createElement(_Paper.default, {
    className: classes.paper
  }, renderTitle(), _react.default.createElement(_Table.default, null, renderHeader(), _react.default.createElement(_TableBody.default, null, renderRows()), renderFooter()));
});
exports.TableCardComponent = TableCardComponent;
TableCardComponent.propTypes = {
  data: _core.PiPropTypes.array.isRequired,
  columns: _core.PiPropTypes.array.isRequired,
  onRowSelected: _core.PiPropTypes.func
};