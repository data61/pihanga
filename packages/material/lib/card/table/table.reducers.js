"use strict";

exports.__esModule = true;
exports.default = void 0;

var _core = require("@pihanga/core");

var _table = require("./table.actions");

var _default = function _default(registerReducer) {
  registerReducer(_table.ACTION_TYPES.RE_SORT, function (state, action) {
    var id = action.id;
    var a = Object.assign({}, action);
    delete a['id'];
    delete a['type'];
    var s = (0, _core.update)(state, ['pihanga', id], a);
    return s; // if (state.pihanga[id] === undefined) {
    //   state = update(state, ['pihanga', id], {});
    // }
    // const x = {a: {b:2, c: 3, d: 4}};
    // var y = update(x, ['a'], {c: 4, e:1});
    // var y = update(y, ['b'], {c: 4, e:1});
    // const curr = state.pihanga[id];
    // const oldTs = curr || {};
    // const ts = {};
    // if (oldTs.orderBy === action.columnId) {
    //   ts.order = oldTs.order === 'desc' ? 'asc' : 'desc';
    // } else {
    //   ts.orderBy = action.columnId;
    //   ts.order = 'asc';
    // }
    // if (curr) {
    //   return update(state, [ 'pihanga', id ], ts);
    // }
    // const h = {};
    // h[action.tableId] = ts;
    // return update(state, ['pihanga', id], h);
  });
  registerReducer(_table.ACTION_TYPES.ROWS_PER_TABLE_PAGE, function (state, action) {
    if (state.scratch.table === undefined) {
      state = (0, _core.update)(state, ['scratch'], {
        table: {}
      });
    }

    var curr = state.scratch.table[action.tableId];
    var rp = {
      rowsPerPage: action.rowsPerPage
    };

    if (curr) {
      return (0, _core.update)(state, ['scratch', 'table', action.tableId], rp);
    }

    var h = {};
    h[action.tableId] = rp;
    return (0, _core.update)(state, ['scratch', 'table'], h);
  });
};

exports.default = _default;