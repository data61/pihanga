import { Card, PiCardSimpleProps } from '@pihanga/core';
import React from 'react';
import { useState } from 'react';
import { useAutoAnimate } from "@formkit/auto-animate/react";

export type ComponentProps = {
  imgUrl: string;
  detailsCard?: string;
  detailsOpts?: { [k: string]: any };
  id?: string;
  width?: number // <= 1 .. percent, > 1 pixel
  showOnHover?: boolean,
  animationDuration?: number; // msec
};

type DetailsEvent = {
  id: string;
  imgUrl: string;
};

export type ShowDetailsEvent = DetailsEvent;
export type HideDetailsEvent = DetailsEvent;

type ComponentT = ComponentProps & {
  onShowDetails: (ev: ShowDetailsEvent) => void;
  onHideDetails: (ev: HideDetailsEvent) => void;
};

export const Component = (props: PiCardSimpleProps<ComponentT>) => {
  const {
    imgUrl,
    detailsCard,
    detailsOpts = {},
    width = 1, // <= 1 ...precent, > 1 pixels
    id = 'unknown',
    showOnHover = false,
    animationDuration = 700,
    onShowDetails,
    onHideDetails,
    cardName,
  } = props;
  const [open, setOpen] = useState(false);
  const [stayOpen, setStayOpen] = useState(false); // only close on click
  const [parentRef, _] = useAutoAnimate({
    duration: animationDuration,
    easing: 'ease-in-out', // "linear" | "ease-in" | "ease-out" | "ease-in-out" 
  });

  function onMouseEnter() {
    if (!showOnHover) return

    setOpen(true)
    onShowDetails({ id, imgUrl })
  }

  function onMouseLeave() {
    if (!showOnHover) return

    if (!stayOpen) {
      setOpen(false)
      onHideDetails({ id, imgUrl })
    }
  }

  function onClick() {
    if (open) {
      if (stayOpen) {
        setOpen(false)
        setStayOpen(false)
        onHideDetails({ id, imgUrl })
      } else {
        setStayOpen(true)
      }
    } else {
      setOpen(true)
      setStayOpen(true)
      onShowDetails({ id, imgUrl })
    }
  }

  const w = width <= 1 ? `${width * 100}%` : `${width}px`
  return (
    <div
      className={`pi-tb-img-w-details pi-tb-img-w-details-${cardName}`}
      data-pihanga={cardName}
    >
      <div style={{ width: w }} ref={parentRef}
        className={`pi-tb-container pi-tb-container-${open ? 'open' : 'closed'}`}
        onClick={onClick}
      >
        <div className={`pi-tb-content`}
          onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}
        >
          <img alt="" src={imgUrl} />
        </div>
        {open && detailsCard && (
          <div className={`pi-tb-details`}>
            <Card cardName={detailsCard} cardKey={imgUrl} id={id} imgUrl={imgUrl} {...detailsOpts} />
          </div>
        )}
      </div>
    </div>
  )
}  