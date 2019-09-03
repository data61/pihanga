import React from 'react';
import { Card } from '@pihanga/core';

import { reloadBackend } from './root.actions';

export const RootComponent = () => {
  reloadBackend();

  return (
    <Card cardName={'page'} />
  );
};
