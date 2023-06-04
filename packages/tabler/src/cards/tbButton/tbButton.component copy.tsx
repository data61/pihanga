import React from 'react';
import { PiCardSimpleProps, ReduxAction } from '@pihanga/core';
import { TbIcon } from '../../components';
import { TbButtonType } from '../constants';

export type ComponentProps = {
  name: string; // used in event
  title: string;
  buttonType: TbButtonType;
  isGhostButton: boolean;
  iconName?: string;
  style?: React.CSSProperties;
  iconStyle?: React.CSSProperties;
};

export type ButtonClickedEvent = {
  name: string;
};
export type ButtonSelectAction = ReduxAction & ButtonClickedEvent;

type ComponentT = ComponentProps & {
  onClicked: (ev: ButtonClickedEvent) => void;
};

export const Component = (props: PiCardSimpleProps<ComponentT>) => {
  const {
    name,
    title,
    buttonType = TbButtonType.Primary,
    isGhostButton = false,
    iconName,
    style,
    iconStyle,
    cardName,
    onClicked,
  } = props;

  function onClick() {
    onClicked({ name })
  }

  const cls = isGhostButton ? `btn-ghost-${buttonType}` : `btn-${buttonType}`
  const s = style || {}
  return (
    <button
      onClick={onClick}
      className={`btn ${cls}`}
      data-pihanga={cardName}
    ><TbIcon iconName={iconName} iconStyle={iconStyle} /><span style={s}>{title}</span></button>
  )
}  