/**
 * CORE folder contains the "core" part of the applications - things that are compulsory for the app
 * to work, and they are used everywhere including all the modules, the root shared folder and
 * the root component
 */
export * from './n1-prop-types';
export * from './input-validators';
export * from './redux';
export * from './router';
export * from './bootstrap';
export { Card } from './card.service';

// NOTE: Attempted moving these logger files into a new subdirectory called "logger".
// But got a circular dependency issue where: logger -> logger.actions -> redux module -> logger
export * from './logger';
export { LOGGER_ACTION_TYPES } from './logger.actions';

