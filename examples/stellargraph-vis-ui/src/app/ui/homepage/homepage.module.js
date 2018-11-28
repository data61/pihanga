import { ROUTING_CONFIG } from './homepage.routing';
import { HOMEPAGE_RESOLVERS } from './homepage.resolvers';

export function init(registerRouting, registerResolvers) {
  registerRouting(ROUTING_CONFIG);
  registerResolvers(HOMEPAGE_RESOLVERS);
}
