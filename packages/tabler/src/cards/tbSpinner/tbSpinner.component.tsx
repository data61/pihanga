import { PiCardSimpleProps } from '@pihanga/core';
import React from 'react';

export type ComponentProps = {
  height?: number;
  color?: SpinnerColor;
  spinnerSize?: SpinnerSize;
  spinnerStyle?: React.CSSProperties;
};

export enum SpinnerSize {
  Small = 'sm',
  Medium = 'md',
  Large = 'lg',
  XL = 'xl',
}

export enum SpinnerColor {
  Blue = 'blue',
  Azure = 'azure',
  Indigo = 'indigo',
  Purple = 'purple',
  Pink = 'pink',
  Red = 'red',
  Orange = 'orange',
  Yellow = 'yellow',
  Lime = 'lime',
  Green = 'green',
  Teal = 'teal',
  Cyan = 'cyan',
}

export const Component = (props: PiCardSimpleProps<ComponentProps>) => {
  const {
    color,
    height = 200,
    spinnerSize = SpinnerSize.XL,
    spinnerStyle,
    cardName,
  } = props;

  let className = ['spinner-border', `spinner-border-${spinnerSize}`]
  if (color != null) {
    className.push(`text-${color}`)
  }
  const style = { height }
  return (
    <div className={`pi-tb-spinner pi-tb-spinner-${cardName}`} style={style} data-pihanga={cardName}>
      <div>
        <div className={className.join(' ')} style={spinnerStyle} role="status" />
      </div>
    </div>
  )
}  