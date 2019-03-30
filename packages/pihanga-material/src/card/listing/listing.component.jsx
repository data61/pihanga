
import React from 'react';

import { PiPropTypes } from '@pihanga/core';
import { TableCardComponent } from '../table';
import { onShowDatasetDetail } from './listing.actions';
import styled from './listing.style';



export const ListingCard = styled(({ columns, data, cardName, scratch = {}, classes }) => {

  function onSelect(row) {
    onShowDatasetDetail(row.name);
  }

  return (
    <TableCardComponent
      id={cardName}
      data={data} 
      columns={columns} 
      scratch={scratch}
    />
  );
});

ListingCard.propTypes = {
  //scratch: N1PropTypes.shape().isRequired,
};
