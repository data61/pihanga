/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable arrow-body-style */
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import SvgIcon from '@material-ui/core/SvgIcon';

import styled from './menuIcon.style';
import { StyleUpdateAction, Selection } from '.';

export const SVG_ICONS = {} as {[key: string]: string};

type IsActiveP = (p: { action: string; styles: any[]; blockType: string }) => boolean;

const DEF_IS_ACTIVE_F = (({ action, styles, blockType }): boolean => {
  return styles.find((e) => e.type === action) !== undefined || blockType === action;
}) as IsActiveP;

type MenuIconType = {
  action: string;
  icon: string;
  iconType: string;
  aria: string;
  type: string;
  blockType: string;
  styles: {[key: string]: string}[];
  isActiveF: IsActiveP;
  editorID: string;
  selection: Selection;
  onUpdate: (a: StyleUpdateAction) => void;
  // svgIcons = [],
  classes: {[key: string]: any };
};

export const MenuIcon = styled((props: MenuIconType): JSX.Element => {
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

  function onClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
    e.preventDefault();
    onUpdate({
      editorID,
      action,
      actionType: type,
      isActive,
      selection,
    });
  }

  function renderIcon(): JSX.Element {
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
    // eslint-disable-next-line jsx-a11y/interactive-supports-focus
    <div
      onMouseDown={onClick}
      role="menu"
      className={`${classes.icon} ${isActive ? classes.activeIcon : ''}`}
    >
      { renderIcon() }
      <Typography variant="srOnly">{aria}</Typography>
    </div>
  );
});
