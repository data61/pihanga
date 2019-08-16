import { RouterComponent } from './router.component';

export function init(register) {
  register.cardComponent({
    name: 'Router', 
    component: RouterComponent, 
  });
}
