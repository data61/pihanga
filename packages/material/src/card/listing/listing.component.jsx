import React from 'react';

import { TableCardComponent } from '../table';

export const ListingCard = ({ columns, data, cardName, scratch = {} }) => {
  return (
    <TableCardComponent
      id={cardName}
      data={data} 
      columns={columns} 
      scratch={scratch}
    />
  );
};

ListingCard.propTypes = {
  //scratch: N1PropTypes.shape().isRequired,
};
