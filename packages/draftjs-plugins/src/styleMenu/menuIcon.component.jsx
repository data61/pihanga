import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import SvgIcon from '@material-ui/core/SvgIcon';

import styled from './menuIcon.style';

export const SVG_ICONS = {};

const DEF_IS_ACTIVE_F = ({action, styles, blockType}) => {
  return styles.find(e => e.type === action) !== undefined || blockType === action;
}

export const MenuIcon = styled((props) => {
  const {
    action,
    icon,
    iconType,
    aria,
    type,
    isActiveF = DEF_IS_ACTIVE_F,
    editorID,
    selection,
    onUpdate,
    // svgIcons = [],
    classes,
  } = props;

  function onClick(e) {
    e.preventDefault();
    onUpdate({
      editorID,
      action,
      actionType: type,
      isActive,
      selection,
    });
  }

  function renderIcon() {
    if (iconType === 'svg') {
      return (
        <SvgIcon>
          <path d={SVG_ICONS[icon]} />
        </SvgIcon>
      );
    } else {
      return (
        <Icon>{icon}</Icon>
      );
    }
  }

  const isActive = isActiveF(props);
  return (
    <div
      onMouseDown={(e) => onClick(e)} 
      className={`${classes.icon} ${isActive ? classes.activeIcon : ''}`}
    >
      { renderIcon() }
      <Typography variant="srOnly">{aria}</Typography>
    </div>
  );
});
