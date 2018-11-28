import { ProjectComponent } from './project.component';

export const ROUTING_CONFIG = {
  '/projects': ProjectComponent,
};

// TODO: do ahead-of-time compilation and load this to a root object.
export const PROJECT_ROUTING = {
  getProjectRoute: () => '/projects',
};
