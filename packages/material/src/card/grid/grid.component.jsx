import React from 'react';
import Grid from '@material-ui/core/Grid';
import isObject from 'lodash.isobject';
import { Card as PiCard, PiPropTypes } from '@pihanga/core';

import styled from './grid.style';

export const GridComp = styled(({
  content = [],
  spacing = 0,
  mui = {},
  classes,
}) => {
  const muiComb = {
    container: true,
    // alignContent: 'stretch',
    // alignItems: 'flex-start',
    // direction: 'row',
    // justify: 'flex-start',
    // wrap: 'nowrap',
    ...mui,
  };

  const defContentOpts = {
    item: true,
    ...{ xs: 12, sm: 12, md: 6 },
  };

  function addContent(opts, id) {
    const { cardName, ...p } = isObject(opts) ? opts : { cardName: opts, ...defContentOpts };
    if (cardName) {
      return (
        <Grid key={id} {...p} className={classes[cardName] || ''}>
          <PiCard cardName={cardName} />
        </Grid>
      );
    } else {
      return (
        <Grid key={id} {...p} className={'missing'}>
          Missing 'cardName' for grid {id}
        </Grid>
      );
    }
  }

  return (
    <Grid spacing={spacing} {...muiComb} className={classes.card}>
      { content.map(addContent) }
    </Grid>  );
});

