import { createCardDeclaration, createOnAction, PiRegister, registerActions, actionTypesToEvents } from '@pihanga/core';
import { ButtonClickedEvent, Component, LinkClickedEvent } from './tbDataGrid.component';
import type { ComponentProps } from './tbDataGrid.component';

export type { DataGridEl } from './tbDataGrid.component';
export { DataGridElType } from './tbDataGrid.component';

const TB_DATA_GRID_CT = 'TbDataGrid';
export const TbDataGrid = createCardDeclaration<ComponentProps>(TB_DATA_GRID_CT)

const ACTION_TYPES = registerActions('TbDgrd', [
  'BUTTON_CLICKED',
  'LINK_CLICKED',
])

export const onTbDataGridButtonClicked = createOnAction<ButtonClickedEvent>(ACTION_TYPES.BUTTON_CLICKED)
export const onTbDataGridLinkClicked = createOnAction<LinkClickedEvent>(ACTION_TYPES.LINK_CLICKED)

export function init(register: PiRegister): void {
  register.cardComponent({
    name: TB_DATA_GRID_CT,
    component: Component,
    events: actionTypesToEvents(ACTION_TYPES),
  });
}
