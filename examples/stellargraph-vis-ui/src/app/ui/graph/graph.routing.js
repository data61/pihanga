import { GraphComponent } from './graph.component';

export const ROUTING_CONFIG = {
  '/graph': GraphComponent,
};

export const GRAPH_ROUTING = {
  getGraphRoute: () => '/graph',
};
