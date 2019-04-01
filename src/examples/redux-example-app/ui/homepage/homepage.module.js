import { ROUTING_CONFIG } from './homepage.routing';
import { HOMEPAGE_REDUCERS } from './homepage.reducers';

export function init({ registerRouting, registerReducers }) {
  registerRouting(ROUTING_CONFIG);
  registerReducers(HOMEPAGE_REDUCERS);
}
