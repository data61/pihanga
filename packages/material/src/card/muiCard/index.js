import { MuiCard } from './muiCard.component';

export function init(register) {
  register.cardComponent({
    name: 'MuiCard', 
    component: MuiCard, 
  });
}
