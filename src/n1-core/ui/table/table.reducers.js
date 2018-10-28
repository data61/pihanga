// import { update } from 'n1-core';

// import { ACTION_TYPES } from './table.actions';

// export default (registerReducer) => {

//   registerReducer(ACTION_TYPES.RE_SORT, (state, action) => {
//     if (state.scratch.table === undefined) {
//       state = update(state, ['scratch'], { table: {}});
//     }
//     const curr = state.scratch.table[action.tableId];
//     const oldTs = curr || {};
//     const ts = {};
//     if (oldTs.orderBy === action.columnId) {
//       ts.order = oldTs.order === 'desc' ? 'asc' : 'desc';
//     } else {
//       ts.orderBy = action.columnId;
//       ts.order = 'asc';
//     }
//     if (curr) {
//       return update(state, ['scratch', 'table', action.tableId ], ts);
//     }
//     const h = {};
//     h[action.tableId] = ts;
//     return update(state, ['scratch', 'table'], h);
//   });

//   registerReducer(ACTION_TYPES.ROWS_PER_TABLE_PAGE, (state, action) => {
//     if (state.scratch.table === undefined) {
//       state = update(state, ['scratch'], { table: {}});
//     }
//     const curr = state.scratch.table[action.tableId];
//     const rp = { rowsPerPage: action.rowsPerPage };
//     if (curr) {
//       return update(state, ['scratch', 'table', action.tableId ], rp);
//     }
//     const h = {};
//     h[action.tableId] = rp;
//     return update(state, ['scratch', 'table'], h);
//   });

// }
