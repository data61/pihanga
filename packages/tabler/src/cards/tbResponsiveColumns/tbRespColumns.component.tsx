import { Card, PiCardSimpleProps } from '@pihanga/core';
import React from 'react';
import { ReportSize, SizeEventT } from '../../components/reportSize';

export type ComponentProps = {
  prefMinWidth: number;
  cards: TbColumnCard[]; // cards to put in columns
};

export type TbColumnCard = {
  name: string;
  key: string; // needs to be unique across array
  props?: { [k: string]: any };
}

export const Component = (props: PiCardSimpleProps<ComponentProps>) => {
  const {
    cards = [],
    prefMinWidth,
    cardName,
  } = props;
  // const ref = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState<number>(0)

  const mw = prefMinWidth > 100 ? prefMinWidth : 100
  const numCols = Math.max(1, Math.floor(width / mw))

  function onSizeChange(ev: SizeEventT) {
    console.log(">>>> SIZE w/h: ", ev.width, ev.height)
    setWidth(ev.width)
  }


  const style = { width: '100%' }
  const css = {
    container: {
      width: '100%',
    },
    row: {
      display: 'flex',
      width: '100%',
    },
    col: {
      flexGrow: 1,
      flexBasis: `calc(100% / ${numCols})`,
    }
  }

  function renderColCard(c: TbColumnCard) {
    return (
      <div className={`pi-tb-item pi-tb-item-${c.name} pi-tb-item-${c.key}`} key={c.key}>
        <Card cardName={c.name} cardKey={c.key} {...(c.props || {})} />
      </div>
    )
  }

  function renderColumn(_: any, colNum: number) {
    const colCards = cards.filter((_: any, idx: number) => {
      return (idx % numCols) === colNum
    })
    return (
      <div className={`pi-tb-column pi-tb-column-${colNum}`} style={css.col} key={colNum}>
        {colCards.map(renderColCard)}
      </div>
    )
  }

  return (
    <div
      style={style}
      className={`pi-tb-resp-columns pi-tb-resp-columns-${cardName}`}
      data-pihanga={cardName}
    >
      <ReportSize onSizeChange={onSizeChange}>
        <div className="pi-tb-row" style={css.row}>
          {Array(numCols).fill(0).map(renderColumn)}
        </div>
      </ReportSize>
    </div>
  )
}  