import { update } from 'n1-core';

import { ACTION_TYPES } from './table.actions';

export default (registerReducer) => {

  registerReducer(ACTION_TYPES.RE_SORT, (state, action) => {
    const id = action.id;
    const a = Object.assign({}, action);
    delete a['id'];
    delete a['type'];
    const s = update(state, [ 'pihanga', id ], a);
    return s;

    // if (state.pihanga[id] === undefined) {
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

  registerReducer(ACTION_TYPES.ROWS_PER_TABLE_PAGE, (state, action) => {
    if (state.scratch.table === undefined) {
      state = update(state, ['scratch'], { table: {}});
    }
    const curr = state.scratch.table[action.tableId];
    const rp = { rowsPerPage: action.rowsPerPage };
    if (curr) {
      return update(state, ['scratch', 'table', action.tableId ], rp);
    }
    const h = {};
    h[action.tableId] = rp;
    return update(state, ['scratch', 'table'], h);
  });

}
