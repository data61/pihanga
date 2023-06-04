import React from 'react';
import { Card, PiCardSimpleProps } from '@pihanga/core';

// body { 
//   display: grid;
//   grid-template-areas: 
//     "header header header"
//     "nav article ads"
//     "footer footer footer";
//   grid-template-rows: 60px 1fr 60px;
//   grid-template-columns: 20% 1fr 15%;
//   grid-gap: 10px;
//   height: 100vh;
//   margin: 0;
//   }

export type TemplateT = {
  area: string[][];
  rows: string[];
  columns: string[];
  gap?: string;
}

export type ComponentProps = {
  cardName: string;
  cards: string[];
  template: TemplateT;
  height?: string;
  margin?: string;
  overflow?: string;
};


type ComponentT = ComponentProps;

export const Component = (props: PiCardSimpleProps<ComponentT>) => {
  const {
    cardName,
    cards = [],
    template,
    height = 'auto', //'100vh',
    margin = 0,
    overflow = 'scroll',
  } = props;

  const c2n = cards.reduce((p, n) => { p[n] = `pi-grid-${cardName}-${n}`; return p }, {} as { [k: string]: string });
  const areaRows = template.area.map((r) => {
    const ca = r.map((c) => {
      const n = c2n[c];
      if (!n) {
        console.error(`Unknown card ref '${c}' in grid template for grid card '${cardName}'`)
        return '???'
      } else {
        return n;
      }
    });
    return ca.join(' ');
  })
  const area = areaRows.reduce((p, e) => `${p} '${e}'`, "").trim()
  console.log('AREA', area);
  const style = {
    display: 'grid',
    gridTemplateAreas: area,
    gridTemplateRows: template.rows.join(' '),
    gridTemplateColumns: template.columns.join(' '),
    gridGap: template.gap || '10px',
    height,
    margin,
    width: '100%',
  }; // having type issues with gridTemplateXXX
  console.log('STYLE', style);
  function renderGridCard(name: string, idx: number) {
    const style = {
      gridArea: c2n[name],
      overflow,
    }
    return (
      <div style={style} key={idx}>
        <Card cardName={name} />
      </div>
    );
  }

  return (
    <div style={style} data-pihanga={cardName}>
      {cards.map(renderGridCard)}
    </div>
  );
};
