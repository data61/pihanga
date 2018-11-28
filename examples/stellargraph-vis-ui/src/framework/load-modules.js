import { RouterComponentWrapper } from './router';
import { LoggerFactory } from './logger';

const logger = LoggerFactory.create('bootstrap');

/**
 * Calls the module's init() with extra parameters passed in.
 *
 * @param logLevel
 * @param moduleById
 * @param extraModuleInitArgs
 * @param serverSideRendering
 * @returns {RouterComponentWrapper}
 */
export function loadModules(
  logLevel, moduleById, extraModuleInitArgs, serverSideRendering,
) {
  LoggerFactory.setLevel(logLevel);

  const routerComponentWrapper = new RouterComponentWrapper(
    {},
    () => {},
    serverSideRendering,
  );

  moduleById.keys().forEach((m) => {
    logger.debug(`Discovered module ${m}`);
    const module = moduleById(m);
    if (module.init !== undefined) {
      module.init.apply(
        module.init,
        [routerComponentWrapper.registerRouting.bind(routerComponentWrapper)]
          .concat(extraModuleInitArgs || []),
      );
    } else {
      // There can be lots of cases where there is no `init()` since the component doesn't need to
      // register any actions OR has any routing config.
      // For these cases, it is intentional, thus, printing out this message is not needed
      // logger.debug(`Module index "${p}" does NOT contain an init() function`);
    }
  });

  return routerComponentWrapper;
}
