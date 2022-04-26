import React from 'react';
import { PiCardProps } from '@pihanga/core';

import styled from './<%= filePrefix %>.style';

export type ComponentProps = {

};

// export type SomeEvent = {
  
// };
// export type SomeAction = ReduxAction & SomeEvent;

type ComponentT = ComponentProps & {
  // onSomething: (ev: SomeEvent) => void;
};

export const Component = styled((props: PiCardProps<ComponentT>) => {
  const {
    cardName,
    classes,
  } = props;

  return (
    <div className={classes.outer} data-pihanga={ cardName }>
      
    </div>
  );
}) as React.FC<ComponentT>;
