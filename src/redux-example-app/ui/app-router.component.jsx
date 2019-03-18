import React from 'react';

export const AppRouterComponent = (routerComponentWrapper) => {
  const routeNotFoundElementFunc = invalidRoutePath => (
    <div>
      <p>
        ERROR: Path &quot;
        {invalidRoutePath}
        &quot; does not exist. Please check your URL.
      </p>
    </div>
  );

  return routerComponentWrapper
    .customise(
      routeNotFoundElementFunc,
    )
    .getRouterComponentConstructor();
};
