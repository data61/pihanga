import React from 'react';
import { PiPropTypes } from '@pihanga/core';
import { Card } from '@pihanga/core';

export const RouterComponent = ({
  cardName, 
  contentCard, 
}) => {
  return (
    <React.Fragment>
      <Card cardName={contentCard} parentCard={cardName} />
    </React.Fragment>
  );
};

RouterComponent.propTypes = {
  contentCard: PiPropTypes.string,
};
