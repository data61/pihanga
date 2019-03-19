/**
 * Used for registering all resolvers from nested modules.
 */
export class Resolvers {
  constructor() {
    this.resolvers = {};
  }

  /**
   * Register a new resolver.
   *
   * This is a two-level merge between the given resolves and current global resolves.
   * Each module resolver has a unique namespace. The same module can be registered twice, but the
   * second registration cannot contain same function names.
   *
   * NOTE: this might need to be be changed if apollo client resolver has deeper level config.
   * There was a case with "Subscription", as follows::
   * Subscription: {
   *   postAdded: {
   *     subscribe: () => pubsub.asyncIterator([POST_ADDED]),
   *   },
   * },
   *
   * However, "subscribe" is the only property, thus, despite of being 3-level deep, the 2-level
   * merge is still acceptable.
   *
   * @param newResolvers
   */
  registerResolvers(newResolvers) {
    Object.keys(newResolvers).forEach(name => {
      const r = this.resolvers[name];
      if (r === undefined) {
        this.resolvers[name] = newResolvers[name];
      } else {
        const resolver = newResolvers[name];
        Object.keys(resolver).forEach(funcName => {
          if (Object.hasOwnProperty.call(r, funcName)) {
            throw new Error(`Duplicate resolver registration: "${name}.${funcName}"`);
          }

          r[funcName] = resolver[funcName];
        });
      }
    });

    return this;
  }

  get() {
    return this.resolvers;
  }
}
