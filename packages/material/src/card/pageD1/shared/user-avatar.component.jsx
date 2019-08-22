import Avatar from '@material-ui/core/Avatar';
import React from 'react';
import { PiPropTypes } from '@pihanga/core';
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
  size: PiPropTypes.number.isRequired,
  user: PiPropTypes.shape().isRequired,
};

