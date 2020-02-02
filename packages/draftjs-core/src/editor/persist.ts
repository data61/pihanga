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

import { getCatalog, initializeCatalog } from '../util';

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

type PersistedState = {
  blocks: B[];
  entities: {[key: string]: E};
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

  const blocks = raw.blocks.map((b) => {
    if (b.data) {
      const d = b.data as {CATALOG_KEY: string};
      delete d.CATALOG_KEY;
    }
    return {
      key: b.key,
      inlineStyleRanges: b.inlineStyleRanges.filter((s) => active.has(s.style)),
      data: b.data as {[key: string]: any},
      depth: b.depth,
      text: b.text,
      type: b.type,
    } as B;
  });
  const entities = {} as {[key: string]: E};
  active.sort().forEach((ek) => {
    // if (FORMATTING_ENTITIES.includes(ek!)) {
    //   return;
    // }
    const e = contentState.getEntity(ek!);
    entities[ek!] = {
      name: key2name[ek!],
      type: e.getType(),
      mutability: e.getMutability() as string,
      data: e.getData() as {[key: string]: any},
    } as E;
  });
  return { blocks, entities };
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
  const old2new = {} as {[key: string]: string};
  const catData = {} as {[key: string]: string};
  const cs3 = Object.entries(ctnt.entities).reduce((csi, el) => {
    const [key, ed] = el;
    const cso = csi.createEntity(ed.type, ed.mutability as DraftEntityMutability, ed.data);
    old2new[key] = catData[ed.name] = cs.getLastCreatedEntityKey();
    return cso;
  }, cs2);
  const cs4 = cs3.replaceEntityData(catKey, catData);

  // Now we need to replace all old entity references in the block's CM with new ones (old2new).
  const cache = new Map<CharacterMetadata, CharacterMetadata>();
  const cmMapper = (cm?: CharacterMetadata) => {
    const ccm = cache.get(cm!);
    if (ccm) return ccm;

    const style = cm!.getStyle().map((k) => old2new[k!]) as OrderedSet<string>;
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
  return [cs4.set('blockMap', bm2) as ContentState, catKey, newBlocks];
};
