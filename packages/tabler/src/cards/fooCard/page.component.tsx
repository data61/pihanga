import React from 'react';
import { PiCardSimpleProps } from '@pihanga/core';

export type ComponentProps = {
  message: string;
};

export type SomeEvent = {
  something: string;
};

type ComponentT = ComponentProps & {
  onSomething: (ev: SomeEvent) => void;
};

export const Component = (props: PiCardSimpleProps<ComponentT>) => {
  const {
    message,
    cardName,
  } = props;

  return (
    <div className={`pi-xxx pi-xxx-${cardName}`} data-pihanga={cardName}>
      {message}
    </div>
  );
}