import Avatar from '@material-ui/core/Avatar';
import React from 'react';
import { N1PropTypes } from 'n1-core';
import userAvatarStyle from './user-avatar.style';

export const UserAvatarComponent = ({ size, user }) => {
  const avatarText = (user && user.name && user.name[0].toUpperCase()) || '';

  return (
    <Avatar
      size={size}
      style={userAvatarStyle}
    >{avatarText}</Avatar>
  );
};

UserAvatarComponent.propTypes = {
  size: N1PropTypes.number.isRequired,
  user: N1PropTypes.shape().isRequired,
};

