import initReducers from './tabbed.reducers';
import { TabbedCardComponent } from './tabbed.component';
import { ACTION_TYPES } from './tabbed.actions';

export * from './tabbed.actions';
export * from './tabbed.component';

export function init(register) {
  initReducers(register.reducer);
  register.cardComponent({
    name: 'PiTabbed', 
    component: TabbedCardComponent, 
    actions: ACTION_TYPES,
    events: {
      // should really refer to action event
      //onTabSelected: ACTION_TYPES.TAB_SELECTED,
    },
  });
}