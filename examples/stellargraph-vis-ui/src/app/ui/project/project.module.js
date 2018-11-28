import { ROUTING_CONFIG } from './project.routing';
import { RESOLVERS } from './project.resolvers';

export function init(registerRouting, registerResolvers) {
  registerRouting(ROUTING_CONFIG);
  registerResolvers(RESOLVERS);
}
