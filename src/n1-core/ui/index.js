import { ACTION_TYPES as PAGE_ACTION_TYPES } from './page';
import { ACTION_TYPES as TABLE_ACTION_TYPES } from './table';
import { ACTION_TYPES as SWITCH_ACTION_TYPES } from './toolbar-switch';

export { PageComponent, registerComponent } from './page';
export { TableComponent, DEF_ROWS_PER_PAGE } from './table';
export { ToolbarSwitch } from './toolbar-switch';

export const ACTION_TYPES = {
  page: PAGE_ACTION_TYPES,
  table: TABLE_ACTION_TYPES,
  switch: SWITCH_ACTION_TYPES,
};