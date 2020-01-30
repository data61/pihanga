import {
  ContentState, 
  RawDraftInlineStyleRange,
  RawDraftEntityRange,
  ContentBlock,
  convertToRaw
} from 'draft-js';

import {
  createSelectionForLength, 
  getBlocksForSelection,
  addEntity,
  addKeyedEntity,
} from '../../util/modifyEntities';

function createText(rows: number, cols: number) {
  return [...Array(rows)].map((_, i) => {
    return [...Array(cols)].map((_, j) => {
      return `${i}.${j}`;
    }).join(' ');
  }).join('\n');
}

it('createSelectionForLength', () => {
  const rows = 5
  const s = createText(rows, 3);
  const cs = ContentState.createFromText(s);
  const bm = cs.getBlockMap();
  expect(bm.size).toEqual(rows);


  const block = bm.toArray()[1];
  const pos = {block, offset: 4, contentState: cs};

  // same block
  const sel = createSelectionForLength(pos, 3); // 2.2
  expect(sel.getAnchorKey()).toEqual(block.getKey());
  expect(sel.getAnchorOffset()).toEqual(pos.offset);
  expect(sel.getFocusKey()).toEqual(block.getKey());
  expect(sel.getFocusOffset()).toEqual(pos.offset + 3);

  // same block to end
  const sel1 = createSelectionForLength(pos, block.getLength() - 3); 
  expect(sel1.getAnchorKey()).toEqual(block.getKey());
  expect(sel1.getAnchorOffset()).toEqual(pos.offset);
  expect(sel1.getFocusKey()).toEqual(block.getKey());
  expect(sel1.getFocusOffset()).toEqual(block.getLength());
  
  // next block
  const sel2 = createSelectionForLength(pos, block.getLength());
  const block2 = bm.toArray()[2];

  expect(sel2.getAnchorKey()).toEqual(block.getKey());
  expect(sel2.getAnchorOffset()).toEqual(pos.offset);
  expect(sel2.getFocusKey()).toEqual(block2.getKey());
  expect(sel2.getFocusOffset()).toEqual(pos.offset - 1); // one <CR>s

  // next block to end
  const sel2a= createSelectionForLength(pos, 2 * block.getLength() - 2);
  expect(sel2a.getAnchorKey()).toEqual(block.getKey());
  expect(sel2a.getAnchorOffset()).toEqual(pos.offset);
  expect(sel2a.getFocusKey()).toEqual(block2.getKey());
  expect(sel2a.getFocusOffset()).toEqual(block2.getLength()); // to end

  // 3rd block
  const sel3 = createSelectionForLength(pos, 2 * block.getLength());
  const block3 = bm.toArray()[3];

  expect(sel3.getAnchorKey()).toEqual(block.getKey());
  expect(sel3.getAnchorOffset()).toEqual(pos.offset);
  expect(sel3.getFocusKey()).toEqual(block3.getKey());
  expect(sel3.getFocusOffset()).toEqual(pos.offset - 2); // two <CR>s
  

});

it('getBlocksForSelection', () => {
  const rows = 3
  const s = createText(rows, 4);
  const cs = ContentState.createFromText(s);
  const bm = cs.getBlockMap();
  const block = bm.toArray()[1];

  const pos = {block, offset: 4, contentState: cs};

  const sel = createSelectionForLength(pos, 3); // single block
  const bs = getBlocksForSelection(sel, cs);
  const a = bs.toArray();
  expect(a.length).toEqual(1);
  expect(a[0]).toEqual(block);

  // two blocks
  const sel2 = createSelectionForLength(pos, block.getLength()); 
  const bs2 = getBlocksForSelection(sel2, cs);
  const a2 = bs2.toArray();
  expect(a2.length).toEqual(2);
  expect(a2[0]).toEqual(block);
  expect(a2[1]).toEqual(bm.toArray()[2]);

});

it('addEntity', () => {
  const rows = 4;
  const s = createText(rows, 4);
  const cs = ContentState.createFromText(s);
  const bm = cs.getBlockMap();
  const block = bm.toArray()[1];


  function addKey(cs: ContentState, offset: number, length: number, id: string) {
    const block = cs.getBlockMap().toArray()[1];
    const pos = {block, offset, contentState: cs};
    const sel = createSelectionForLength(pos, length);
    //return addKeyedEntity(cs, sel, key);
    return addEntity(cs, sel, 'XXX', 'MUTABLE', {id});
  }

  function testStyleRange(sa: RawDraftInlineStyleRange[], offset: number, length: number, style: string) {
    const s = sa.find(s => s.style === style);
    expect(s!.offset).toEqual(offset);
    expect(s!.length).toEqual(length);
    expect(s!.style).toEqual(style);
  }

  function testEntityRange(cs: ContentState, 
    block: ContentBlock, 
    offset: number, 
    length: number, 
    entityID: string
  ) {
    for (let i = 0; i < length; i++) {
      testEntityRangeAt(cs, block, offset + i, entityID);
    }
  }

  function testEntityRangeAt(cs: ContentState, 
    block: ContentBlock, 
    index: number, 
    entityID: string
  ) {
    const ek = block.getEntityAt(index);
    expect(ek).toBeDefined();

    const e = cs.getEntity(ek);
    expect(e).toBeDefined();
    expect(e.getType()).toEqual('EREF');
    const d = e.getData();
    expect(d.refs).toContain(entityID);
  }

  function countEntitiesForBlock(block: ContentBlock) {
    let set = new Set();
    for (let i = 0; i < block.getLength(); i++) {
      const e = block.getEntityAt(i);
      if (e) set.add(e);
    }
    return set.size;
  }

  const [ek1, cs1] = addKey(cs, 4, 5, '1');
  console.log(JSON.stringify(convertToRaw(cs1), null, 2));

  cs1.getBlocksAsArray().forEach((b, i) => {
    switch (i) {
      case 1: 
        expect(countEntitiesForBlock(b)).toEqual(1);
        testEntityRange(cs1, b, 4, 5, ek1);
        break;
      default:
        expect(countEntitiesForBlock(b)).toEqual(0);
    }
  });


  const [ek2, cs2] = addKey(cs1, 8, block.getLength(), '2');
  cs2.getBlocksAsArray().forEach((b, i) => {
    switch (i) {
      case 1: 
        expect(countEntitiesForBlock(b)).toEqual(3);
        testEntityRange(cs2, b, 4, 5, ek1);
        testEntityRange(cs2, b, 8, 7, ek2);
        break;
      case 2:
        expect(countEntitiesForBlock(b)).toEqual(1);
        testEntityRange(cs2, b, 0, 7, ek2);
        break;
      default:
          expect(countEntitiesForBlock(b)).toEqual(0);
    }
  });

  const [ek3, cs3] = addKey(cs2, 6, 2 * block.getLength(), '3');
  console.log("CS3", JSON.stringify(convertToRaw(cs3), null, 2));
  cs3.getBlocksAsArray().forEach((b, i) => {
    switch (i) {
      case 1: 
        expect(countEntitiesForBlock(b)).toEqual(4);
        testEntityRange(cs3, b, 4, 5, ek1);
        testEntityRange(cs3, b, 8, 7, ek2);
        testEntityRange(cs3, b, 6, 9, ek3);
        break;
      case 2:
        expect(countEntitiesForBlock(b)).toEqual(2);
        testEntityRange(cs3, b, 0, 7, ek2);
        testEntityRange(cs3, b, 0, 15, ek3);
        break;
      case 3:
        expect(countEntitiesForBlock(b)).toEqual(1);
        testEntityRange(cs3, b, 0, 4, ek3);
        break;
      default:
        expect(countEntitiesForBlock(b)).toEqual(0);
    }
  });
});
