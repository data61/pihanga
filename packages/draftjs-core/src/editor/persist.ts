import { createLogger } from '@pihanga/core';
import {
  convertToRaw,
  convertFromRaw,
  EditorState,
  ContentState,
  CharacterMetadata,
  RawDraftInlineStyleRange,
  RawDraftContentBlock,
  DraftEntityMutability,
} from 'draft-js';
import { OrderedSet } from 'immutable';
import { canonicalize } from 'json-canonicalize';

import { getCatalog, initializeCatalog } from '../util';
import sha1 from './sha1';

const logger = createLogger('PiEditor:persist');

type B = {
  key: string;
  inlineStyleRanges: RawDraftInlineStyleRange[];
  data?: {[key: string]: any};
  depth?: number;
  text?: string;
  type?: string;
};

type E = {
  name: string;
  type: string;
  mutability: string;
  data?: {[key: string]: any};
};

type H = {
  blocks: {[blockKey: string]: string};
  entities: {[entityKey: string]: string};
};

export type PersistedState = {
  blocks: B[];
  entities?: {[key: string]: E};
  hashes?: H;
  lastSaved?: number;
}

const FORMATTING_ENTITIES = ['BOLD', 'ITALIC'];

export const persistState = (editorState: EditorState): PersistedState => {
  const contentState = editorState.getCurrentContent();
  const raw = convertToRaw(contentState);
  let eSet = OrderedSet<string>();
  contentState.getBlockMap().forEach((b) => {
    b!.getCharacterList().forEach((cm) => {
      eSet = eSet.union(cm!.getStyle());
    });
  });
  const active = eSet.filter((ek) => {
    try {
      const e = contentState.getEntity(ek!);
      return !e.getData().__removed;
    } catch {
      return false;
    }
  });
  const catalog = getCatalog(contentState) as {[key: string]: any};
  const key2name: {[key: string]: string} = {};
  Object.entries(catalog).forEach(([n, k]) => {
    key2name[k] = n;
    return n;
  });

  const b2h = {} as {[key: string]: string};
  const blocks = raw.blocks.map((b, i) => {
    if (b.data) {
      const d = b.data as {CATALOG_KEY: string};
      delete d.CATALOG_KEY;
    }
    const inlineStyleRanges = b.inlineStyleRanges
      .filter((s) => active.has(s.style))
      .map((s) => ({ ...s, style: key2name[s.style] || s.style }));
    const bs = {
      key: b.key,
      inlineStyleRanges,
      data: b.data as {[key: string]: any},
      depth: b.depth,
      text: b.text,
      type: b.type,
    } as B;
    b2h[b.key] = sha1(canonicalize(bs));
    return bs;
  });
  const entities = {} as {[key: string]: E};
  const e2h = {} as {[key: string]: string};
  active.sort().forEach((_ek) => {
    const ek = _ek!;
    // if (FORMATTING_ENTITIES.includes(ek!)) {
    //   return;
    // }
    const e = contentState.getEntity(ek);
    const eid = key2name[ek];
    const es = {
      type: e.getType(),
      mutability: e.getMutability() as string,
      data: e.getData() as {[key: string]: any},
    } as E;
    entities[eid] = es;
    e2h[eid] = sha1(canonicalize(es));
  });
  const hashes = { blocks: b2h, entities: e2h };
  const lastSaved = Date.now();
  return {
    blocks, entities, hashes, lastSaved,
  };
};

export const createContentState = (
  content: any,
): [ContentState, string, string[]] => {
  const ctnt = content as PersistedState;

  const cs = convertFromRaw({
    blocks: ctnt.blocks as RawDraftContentBlock[],
    entityMap: {},
  });
  const [catKey, cs2] = initializeCatalog(cs);
  if (!ctnt.entities) {
    // no entities to process. All done.
    const keys = cs2.getBlockMap().keySeq().toArray();
    return [cs2, catKey, keys];
  }
  // const old2new = {} as {[key: string]: string};
  const catData = {} as {[key: string]: string};
  const cs3 = Object.entries(ctnt.entities).reduce((csi, el) => {
    const [key, ed] = el;
    const cso = csi.createEntity(ed.type, ed.mutability as DraftEntityMutability, ed.data);
    catData[key] = cs.getLastCreatedEntityKey();
    return cso;
  }, cs2);
  const cs4 = cs3.replaceEntityData(catKey, catData);

  // Now we need to replace all old entity references in the block's CM with new ones (old2new).
  const cache = new Map<CharacterMetadata, CharacterMetadata>();
  const cmMapper = (cm?: CharacterMetadata) => {
    const ccm = cache.get(cm!);
    if (ccm) return ccm;

    const style = cm!.getStyle().flatMap((k) => {
      const e = ctnt.entities ? ctnt.entities[k!] : null;
      if (!e) {
        logger.warn(`Missing entity '${k}'`);
      }
      const n = catData[k!];
      const t = e ? `${e.type}_T` : 'UNKNOWN_T';
      return [n, t];
    }) as OrderedSet<string>;
    const cm2 = CharacterMetadata.create({ style });
    cache.set(cm!, cm2);
    return cm2;
  };
  const newBlocks = [] as string[];
  const bm2 = cs4.getBlockMap().map((b) => {
    newBlocks.push(b!.getKey());
    const cl = b!.getCharacterList().map(cmMapper);
    const data = b!.getData().set('CATALOG_KEY', catKey);
    return b!.merge({
      characterList: cl,
      data,
    });
  });
  const cs5 = cs4.set('blockMap', bm2) as ContentState;
  const raw = convertToRaw(cs5);
  return [cs5, catKey, newBlocks];
};
