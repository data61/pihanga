import React from 'react';
import { Card, PiCardSimpleProps } from '@pihanga/core';

export type ComponentProps = {
  childCard: string;
};

export const Component = (props: PiCardSimpleProps<ComponentProps>) => {
  const {
    childCard,
    cardName,
  } = props;

  return (
    <div className={`pi-switcher pi-switcher-${cardName}`} data-pihanga={cardName}>
      <Card cardName={childCard} />
    </div>
  )
}  