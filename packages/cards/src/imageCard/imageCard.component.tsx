import React from 'react';
import { PiCardSimpleProps } from '@pihanga/core';

export type ComponentProps = {
  imgURL: string;
  caption: string;
  width?: number;
  height?: number;
};

export type ClickEvent = {

};

type ComponentT = ComponentProps & {
  onClicked: (ev: ClickEvent) => void;
};

export const Component = (props: PiCardSimpleProps<ComponentT>) => {
  const {
    imgURL,
    caption,
    width,
    height,
    onClicked,
    cardName,
  } = props;

  function clicked(ev: React.MouseEvent<HTMLImageElement>) {
    onClicked({

    })

  }

  const ip = {
    src: imgURL,
    height: height && height > 0 ? height : undefined,
    width: width && width > 0 ? width : undefined,
  }
  return (
    <div className={`pi-img-card pi-img-card-${cardName}`} data-pihanga={cardName}>
      <img {...ip} alt={caption} onClick={clicked} />
    </div>
  );
}