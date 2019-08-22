import { AnswerComponent } from './answer.component';
import { ACTION_TYPES  } from './answer.actions';
export * from './answer.actions';

export function init(register) {
  register.cardComponent({
    name: 'Answer', 
    component: AnswerComponent, 
    events: {
      onNewRequest: ACTION_TYPES.NEW_REQUEST
    },
  });
}
