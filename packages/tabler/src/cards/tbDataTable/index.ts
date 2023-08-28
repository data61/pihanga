import { registerActions, PiRegister, PiMapProps, PiCardDef, createOnAction, actionTypesToEvents, } from '@pihanga/core';
import { ButtonEvent, ColSortEvent, Component, HideDetailEvent, RowSelectEvent, ShowDetailEvent } from './datatable.component';
import type { ComponentProps, ToggleEvent } from './datatable.component';

export type { Column, Row, DetailContext, ButtonEvent as TbDataTableButtonEvent } from './datatable.component';
export { ColumnType, } from './datatable.component';

const TB_DATA_TABLE_CT = 'TbXLDataTable';

type CardProps<S, D> = PiMapProps<ComponentProps<D>, S>;
export function TbXlDataTable<S, D = { [k: string]: any }>(p: CardProps<S, D>): PiCardDef {
  return {
    ...p,
    cardType: TB_DATA_TABLE_CT,
  }
}

export const ACTION_TYPES = registerActions('TBDTABLE', [
  'ROW_SELECT',
  'COLUMN_SORT',
  'SHOW_DETAIL',
  'HIDE_DETAIL',
  'NEXT_PAGE',
  "PREV_PAGE",
  "BUTTON_CLICKED",
  "CHECKBOX_CLICKED",
])

export const onTbXlDataTableRowSelect = createOnAction<RowSelectEvent>(ACTION_TYPES.ROW_SELECT)
export const onTbXlDataTableColumnSort = createOnAction<ColSortEvent>(ACTION_TYPES.COLUMN_SORT)
export const onTbXlDataTableShowDetail = createOnAction<ShowDetailEvent<any>>(ACTION_TYPES.SHOW_DETAIL)
export const onTbXlDataTableHideDetail = createOnAction<HideDetailEvent<any>>(ACTION_TYPES.HIDE_DETAIL)
export const onTbXlDataTableButtonClicked = createOnAction<ButtonEvent<any>>(ACTION_TYPES.BUTTON_CLICKED)
export const onTbXlDataTableCheckboxClicked = createOnAction<ToggleEvent<any>>(ACTION_TYPES.CHECKBOX_CLICKED)

export function init(register: PiRegister): void {
  register.cardComponent({
    name: TB_DATA_TABLE_CT,
    component: Component,
    events: actionTypesToEvents(ACTION_TYPES),
  });
}
