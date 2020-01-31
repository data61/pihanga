import { 
  SelectionState, 
  ContentState, 
  ContentBlock, 
  DraftEntityType, 
  DraftEntityMutability,
  CharacterMetadata,
  BlockMap,
} from 'draft-js';
import Immutable = require('immutable');


// entity key for catalog
// const CATALOG_KEY = '1';

// const EREF_TYPE = 'EREF';

export interface Position {
  block: ContentBlock;
  offset: number;
  contentState: ContentState
}

export type EntityKey = string;

/**
 * Used as 'data' in entities of type 'EREF' to 
 * identify the actual entities applicable for a span
 *
 * @interface EntityRef
 */
interface EntityRef {
  key: string,
  refs: string[]
}

// this is identical to 'DraftEntityInstance' which is unfortunately not exported
interface Entity {
  getType(): DraftEntityType,
  getMutability(): DraftEntityMutability,
  getData(): Object,
}

/**
 * Return a selection starting at 'anchor' and extending 'lenght' characters.
 * 
 * @param {Position} anchor Start of selection
 * @param {number} length length in characters of selection
 */
export const createSelectionForLength = (
  anchor: Position,
  length: number,
): SelectionState => {
  const ab = anchor.block;
  const ns =  SelectionState.createEmpty(ab.getKey());
  const blockRem = ab.getLength() - anchor.offset + 1; // add <CR>;
  if (length <= blockRem) {
    const fo = anchor.offset + length;
    let m = { 
      anchorOffset: anchor.offset, 
      focusOffset: length === blockRem ? fo - 1 : fo,
    };
    return ns.merge(m) as SelectionState;
  }
  // extends to consecutive blocks
  const cs = anchor.contentState;
  const remBlocks = cs.getBlockMap().toSeq().skipUntil(b => b === ab).skip(1);
  interface R {
    rem: number;
    ss?: SelectionState;
  };
  const r = remBlocks.reduce((p, b) => {
    const rem = p!.rem;
    if (rem <= 0) return p!;

    const bl = b!.getLength() + 1; // add <CR>
    if (rem <= bl) {
      let m = { 
        anchorOffset: anchor.offset, 
        focusOffset: rem === bl ? rem - 1 : rem, // silently ignore <CR>
        focusKey: b!.getKey(),
      };
      const ss = ns.merge(m) as SelectionState;
      return {rem: 0, ss};
    } else {
      return {rem: p!.rem - bl};
    }
  }, {rem: length - blockRem}) as R;
  return r.ss!;
};

export const getBlocksForSelection = (
  selection: SelectionState,
  contentState: ContentState, 
) : Immutable.Iterable<string, ContentBlock> => {
  const startKey = selection.getStartKey();
  const endKey = selection.getEndKey();
  const bm = contentState.getBlockMap() //.toSeq()
    .skipUntil((_, key) => key === startKey);

  if (startKey === endKey) {
    return bm.take(1);
  }

  const m = () => {
    let foundEnd = false;
    return (_?: ContentBlock, key?: string) => {
      if (foundEnd) {
        return true;
      }
      foundEnd = key === endKey;
      return false;
    }
  }

  return bm.takeUntil(m());
}

export const addEntity = (
  contentState: ContentState, 
  selection: SelectionState,
  name: string | null,
  type: DraftEntityType,
  mutability: DraftEntityMutability,
  data?: Object,
) : [EntityKey, ContentState] => {
  let cs = contentState.createEntity(type, mutability, data);
  const eKey = cs.getLastCreatedEntityKey();
  if (name) {
    // store in catalog
    const ck = getCatalogKey(contentState);
    const ce = cs.getEntity(ck);
    if (ce.getData()[name]) {
      console.warn(`Overwriting entity '${name}' in catalog`);
    }
    const h: {[key:string]:string} = {};
    h[name] = eKey;
    cs = cs.mergeEntityData(ck, h);
  }
  return [eKey, addKeyedEntity(cs, selection, eKey)];
}

export const getCatalog = (
  contentState: ContentState,
): {[key:string]:EntityKey} => {
  const ck = getCatalogKey(contentState);
  const ce = contentState.getEntity(ck);
  return ce.getData();
}

const getCatalogKey = (
  contentState: ContentState, 
) => {
  const b = contentState.getBlockMap().first();
  if (!b) {
    throw Error('Can\'t get CATALOG_KEY because content state doesn\'t have a block yet');
  }
  const key = b.getData().get('CATALOG_KEY');
  return key;
}

/**
 * Initialize an entity catalog for this 'cs'. Should only be called once!
 * 
 * @param contentState 
 */
export const initializeCatalog = (
  contentState: ContentState, 
): [EntityKey, ContentState] => {
  let cs = contentState.createEntity('CATALOG', 'MUTABLE', {});
  const eKey = cs.getLastCreatedEntityKey();
  return [eKey, cs];
}

export const addNamedEntity = (
  contentState: ContentState, 
  selection: SelectionState,
  name: string,
  ifMissingF: () => [DraftEntityType, DraftEntityMutability, Object?]
) : ContentState => {
  // look up in catalog
  const ce = contentState.getEntity(getCatalogKey(contentState));
  const eKey = ce.getData()[name] as string;
  if (!eKey) {
    if (ifMissingF) {
      const [type, mutability, data] = ifMissingF();
      const cs = addEntity(contentState, selection, name, type, mutability, data)[1];
      return cs;
    }
    throw Error(`Missing entity '${name}' in catalog`);
  }
  return addKeyedEntity(contentState, selection, eKey);
}

interface State {
  cs: ContentState,
  entities: {[key:string]:string},
}

/**
 * Add entity to a selection.
 * 
 * As DraftJs only supports one entity per character span, we emulate
 * this by adding the entity key as a style.
 * 
 * @param contentState 
 * @param selection 
 * @param entityKey 
 */
export const addKeyedEntity = (
  contentState: ContentState, 
  selection: SelectionState,
  entityKey: string,
) : ContentState => {
  return mapSelection(contentState, selection, (b, s, e, state) => {
    return addEntityToBlock(b!, entityKey, s, e, state);
  });
}

const addEntityToBlock = (
  b : ContentBlock,
  entityKey: string,
  // defRefKey: string,
  startOffset: number,
  endOffset: number,
  state: State,
) : [ContentBlock, State] => {
  const cl2 = b!.getCharacterList().map((cm, i) => {
    if (i! < startOffset || i! >= endOffset) return cm;
    return CharacterMetadata.applyStyle(cm!, entityKey);
  });
  return [b!.set('characterList', cl2) as ContentBlock, state];
}

// const createEntityRef = (
//   entityKey: string,
//   state: State,
//   existingRefKey? : string
// ) : string => {
//   let refs;
//   if (existingRefKey) {
//     refs = [...state.cs.getEntity(existingRefKey).getData().refs]
//       .filter(v => v !== entityKey)
//       .concat(entityKey)
//       .sort();
//   } else {
//     refs = [entityKey];
//   }
//   const key = refs.join('.');
//   const cached = state.entities[key];
//   if (cached) {
//     return cached;
//   }

//   const rdata: EntityRef = { key, refs };
//   state.cs = state.cs.createEntity(EREF_TYPE, 'MUTABLE', rdata);
//   const eKey = state.cs.getLastCreatedEntityKey();
//   state.entities[key] = eKey;
//   return eKey;
// }

export const mapSelection = (
  contentState: ContentState, 
  selection: SelectionState,
  mapF: (b : ContentBlock, startOffset: number, endOffset: number, state: State) => [ContentBlock, State],
) : ContentState => {
  const startKey = selection.getStartKey();
  const endKey = selection.getEndKey();
  let state: State = {cs: contentState, entities: {}};
  const newBlocks = getBlocksForSelection(selection, contentState)
    .map(b => {
      const k = b!.getKey();
      const s = k === startKey ? selection.getStartOffset() : 0;
      const e = k === endKey ? selection.getEndOffset() : b!.getLength();
      const [b2, s2] = mapF(b!, s, e, state);
      state = s2; // necessary kludge as we might have to create a new entity
      return b2;
    });
  const blockMap = state.cs.getBlockMap();
  return state.cs.merge({
    blockMap: blockMap.merge(newBlocks),
  }) as ContentState;
}

export const removeNamedEntity = (
  contentState: ContentState, 
  selection: SelectionState,
  name: string,
): ContentState => {
  // look up in catalog
  const ce = contentState.getEntity(getCatalogKey(contentState));
  const eKey = ce.getData()[name] as string;
  if (!eKey) {
    throw Error(`Missing entity '${name}' in catalog`);
  }
  return removeKeyedEntity(contentState, selection, eKey);
}

/**
 * Remove entity from a selection.
 * 
 * As DraftJs only supports one entity per character span, we emulate
 * this by adding the entity key as a style.
 * 
 * @param contentState 
 * @param selection 
 * @param entityKey 
 */
export const removeKeyedEntity = (
  contentState: ContentState, 
  selection: SelectionState,
  entityKey: string,
) : ContentState => {
  //const cs = contentState.mergeEntityData(entityKey, {__removed: true});
  const cs = contentState; //.mergeEntityData(entityKey, {__removed: true});
  if (!selection) {
    return cs;
  }
  return mapSelection(cs, selection, (b, s, e, state) => {
    return removeEntityFromBlock(b!, entityKey, s, e, state);
  });
}

const removeEntityFromBlock = (
  b : ContentBlock,
  entityKey: string,
  startOffset: number,
  endOffset: number,
  state: State,
) : [ContentBlock, State] => {
  const cl2 = b!.getCharacterList().map((cm, i) => {
    if (i! < startOffset || i! >= endOffset) return cm;
    return CharacterMetadata.removeStyle(cm!, entityKey);
  });
  return [b!.set('characterList', cl2) as ContentBlock, state];
}

export const removeNamedEntities = (
  contentState: ContentState, 
  selection: SelectionState,
  regex: RegExp,
): ContentState => {
  const ks = getNamedEntities(contentState, regex);
  // Should also remove matching keys from catalog
  let cs = contentState;
  ks.forEach(ek => {
    cs = removeKeyedEntity(cs, selection, ek);
  });
  return cs;
}

export const removeNamedEntitiesFromBlocks = (
  contentState: ContentState, 
  blocks: string[],
  regex: RegExp,
): ContentState => {
  const ks = Array.from(getNamedEntities(contentState, regex));
  // Should also remove matching keys from catalog
  let cs = contentState;
  const bm = cs.getBlockMap() as BlockMap;
  const bm2 = bm.map((b, bk) => {
    if (!blocks.includes(bk!)) {
      return b;
    }
    const cl2 = b!.getCharacterList().map((cm, i) => {
      return ks.reduce((cmi, s) => {
        return CharacterMetadata.removeStyle(cmi!, s);
      }, cm);
    });
    return b!.set('characterList', cl2);
  }) as BlockMap;
  return cs.merge({
    blockMap: bm.merge(bm2),
  }) as ContentState;
}

export const getNamedEntities = (
  contentState: ContentState, 
  regex: RegExp,
): Set<string> => {
  // look up in catalog
  const ce = contentState.getEntity(getCatalogKey(contentState));
  const ks = new Set<string>();
  Object.entries(ce.getData() as {[key:string]:string}).forEach(([k, v]) => {
    if (k.match(regex)) {
      ks.add(v);
    }
  });
  return ks;
}

/**
 * Return entity key for named entity.
 * 
 * @param contentState 
 * @param name 
 */
export const getNamedEntity = (
  contentState: ContentState, 
  name: string,
): string | undefined => {
  // look up in catalog
  const catalog = getCatalog(contentState);
  return catalog[name];
}


/**
 * Return a list of entities which are assigned to entire 
 * selection.
 */
export const entitiesForSelection = (
  contentState: ContentState, 
  selection: SelectionState,
): Entity[] => {
  const startKey = selection.getStartKey();
  const endKey = selection.getEndKey();
  let entSet = null as Immutable.OrderedSet<string> | null;
  getBlocksForSelection(selection, contentState).forEach(b => {
    const k = b!.getKey();
    const sOff = k === startKey ? selection.getStartOffset() : 0;
    const eOff = k === endKey ? selection.getEndOffset() : b!.getLength();
    b!.getCharacterList().forEach((cm, i) => {
      if (i! < sOff || i! > eOff) return;

      const sy = cm!.getStyle();
      entSet = entSet ? entSet.intersect(sy) : sy;
    });
  });
  return entSet ? entSet.toArray().map((k) => contentState.getEntity(k)) : [];
};

// const entitiesForRefEntity = (
//   refKey: string,
//   contentState: ContentState
// ) : Entity[] => {
//   const refs = entityKeysForRefEntity(refKey, contentState);
//   return refs.map(k => {
//     const e = (contentState.getEntity(k)) as Entity;
//     if (!e) {
//       console.error(`Missing entity reference '${e}'`);
//       return null;
//     }
//     return e;
//   }).filter(e => e !== null) as Entity[];
// }

// const entityKeysForRefEntity = (
//   refKey: string,
//   contentState: ContentState
// ): string[] => {
//   const e = contentState.getEntity(refKey);
//   if (!e) {
//     throw Error(`Requesting unknown ref entity '${refKey}'`);
//   }
//   if (e.getType() !== EREF_TYPE) {
//     throw Error(`Requesting NON ref entity '${refKey}' - '${e.getType()}'`);
//   }
//   const refs = e.getData().refs;
//   return refs;
// }
