import { SpinnerComponent } from './spinner.component';
import { ACTION_TYPES  } from './spinner.actions';

export * from './spinner.actions';

export function init(register) {
  register.cardComponent({
    name: 'Spinner', 
    component: SpinnerComponent, 
    events: {
      onCancelRequest: ACTION_TYPES.CANCEL_REQUEST,
    }
  });
}
