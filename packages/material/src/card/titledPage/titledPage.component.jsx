import React from 'react';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import { Card } from '@pihanga/core';

import styled from './titledPage.style';

export const TitledPage = styled(({
  cardName,
  title = '???',
  avatar = null,
  contentCard,
  mui = {},
  classes,
}) => {
  function addAvatar() {
    if (avatar) {
      const m = mui.avatar || { color: 'primary' };
      return (
        <>
          <Icon className={classes.avatar} {...m}>{avatar}</Icon>
          <Typography variant="srOnly">Create a user</Typography>
        </>
      );
    }
    return null;
  }

  const tm = mui.title || { component: 'h1', variant: 'h5' };
  return (
    <div className={classes.card}>
      { addAvatar() }
      <Typography {...tm}>
        {title}
      </Typography>
      <div className={classes.content} {...mui.content}>
        <Card cardName={contentCard} parentCard={cardName} />
      </div>
    </div>
  );
});
