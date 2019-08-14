import initReducers from './table.reducers';
import { TableCardComponent } from './table.component';
import { ACTION_TYPES } from './table.actions';

export * from './table.component';
export * from './table.actions';

export function init(register) {
  initReducers(register.reducer);
  register.cardComponent({
    name: 'Table', 
    component: TableCardComponent, 
    events: {
      onRowSelected: ACTION_TYPES.ROW_SELECTED,
      onColumnSelected: ACTION_TYPES.COLUMN_SELECTED,
      clickSortColumn: ACTION_TYPES.RE_SORT,
      gotoPage: ACTION_TYPES.GOTO_TABLE_PAGE, 
      setRowsPerPage: ACTION_TYPES.ROWS_PER_TABLE_PAGE,
    }
  });
}