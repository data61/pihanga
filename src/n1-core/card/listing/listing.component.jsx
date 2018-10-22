
import React from 'react';

import { N1PropTypes } from 'n1-core';
import { PageComponent, TableComponent } from 'n1-core/ui';
import { onShowDatasetDetail } from './listing.actions';
import styled from './listing.style';



export const ListingCard = styled(({ columns, data, cardName, scratch = {}, classes }) => {

  function onSelect(row) {
    onShowDatasetDetail(row.name);
  }

  return (
    <TableComponent
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
