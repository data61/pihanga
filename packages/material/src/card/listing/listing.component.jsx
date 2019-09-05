import React from 'react';

import { TableCardComponent } from '../table';

export const ListingCard = ({
  columns, data, cardName, scratch = {},
}) => (
  <TableCardComponent
    id={cardName}
    data={data}
    columns={columns}
    scratch={scratch}
  />
);

ListingCard.propTypes = {
};
