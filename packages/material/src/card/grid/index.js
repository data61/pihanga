import { GridComp } from './grid.component';

export function init(register) {
  register.cardComponent({
    name: 'PiGrid',
    component: GridComp,
  });
}
