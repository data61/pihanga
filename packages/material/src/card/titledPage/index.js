import { TitledPage } from './titledPage.component';

export function init(register) {
  register.cardComponent({
    name: 'PiTitledPage',
    component: TitledPage,
  });
}
