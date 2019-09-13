import { NetworkComponent } from './network.component';
import { registerActions } from '@pihanga/core';

const Domain = 'NETWORK';
export const ACTION_TYPES = registerActions(Domain, ['ON_NODE', 'ON_LINK']);

export function init(register) {
  register.cardComponent({
    name: 'Network', 
    component: NetworkComponent, 
    events: {
      onNode: ACTION_TYPES.ON_NODE,
      onLink: ACTION_TYPES.ON_LINK,
    }
  });
}
