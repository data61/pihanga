
import SimplePageComponent from './simplePage.component';

export function init(register) {
  register.cardComponent({
    name: 'PiSimplePage',
    component: SimplePageComponent,
  });
}
