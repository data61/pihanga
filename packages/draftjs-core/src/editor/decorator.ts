import { withStyles, Theme } from '@material-ui/core/styles';
import {
  Entity, ContentState, ContentBlock, EntityInstance,
} from 'draft-js';
import { DropTargetMonitor, DragSourceMonitor, DragObjectWithType } from 'react-dnd';
import { createLogger } from '@pihanga/core';

import DecoratedSpan, { StylesSpanProps } from './decoratedSpan.component';
// import { getCatalog } from '../util';

const logger = createLogger('editor:decorator');

// Alert: Can't figure out on how to import 'DraftDecoratorType'
// import type { DraftDecoratorType } from 'draft-js';
// Copied from https://github.com/facebook/draft-js/blob/master/src/model/decorators/DraftDecoratorType.js
/**
 * An interface for document decorator classes, allowing the creation of
 * custom decorator classes.
 *
 * See `CompositeDraftDecorator` for the most common use case.
 */
export type DraftDecoratorType = {
  /**
   * Given a `ContentBlock`, return an immutable List of decorator keys.
   */
  getDecorations(
    block: ContentBlock,
    contentState: ContentState,
  ): Immutable.List<string>;

  /**
   * Given a decorator key, return the component to use when rendering
   * this decorated range.
   */
  getComponentForKey(key: string): Function;

  /**
   * Given a decorator key, optionally return the props to use when rendering
   * this decorated range.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getPropsForKey(key: string): Record<string, any>;
};
// end of copy

export type DecoratorDeclaration = [DecorationMapper, DecoratorClassDef | undefined];

// e, p, classes, contentState, ek, editorOpts, props
export type DecorationMapper = (
  entity: EntityInstance,
  elProps: ElementProps, // what to collect
  classes: {[key: string]: string},
  contentState: ContentState,
  entityKey: string,
  editorOpts: EditorOpts,
  parentProps: ParentProps,
) => void;

export type EditorOpts = {
  editorID: string;
};

export type ParentProps = {
  contentState: ContentState;
  decoratedText: string;
  start: number;
  end: number;
  blockKey: string;
  entityKey: string | undefined;
  editorOpts: EditorOpts;
  // classes: {[key:string]:string},
};

export type ElementProps = {
  props: {[key: string]: any}; // props given to span element
  className: string[];
  element?: string; // DOM element to use instead of 'span'
  onClick?: Function;
  refF: ((node: any) => void)[]; // callback to get span's DOM reference
  useDrag?: DragProps;
  useDrop?: DropProps;

};

type TargetType = string | string[];
type DragObject = DragObjectWithType & {[key: string]: any};
type DropResult = any;

export type DragProps = {
  /**
   * A plain javascript item describing the data being dragged.
   * This is the only information available to the drop targets about the drag
   * source so it's important to pick the minimal data they need to know.
   *
   * You may be tempted to put a reference to the component or complex object here,
   * but you shouldx try very hard to avoid doing this because it couples the
   * drag sources and drop targets. It's a good idea to use something like
   * { id: props.id }
   *
   */
  item: DragObject;

  /**
   * When the dragging starts, beginDrag is called. If an object is returned from this function it will overide the default dragItem
   */
  begin?: (monitor: DragSourceMonitor) => DragObject | undefined | void;

  /**
   * Optional.
   * When the dragging stops, endDrag is called. For every beginDrag call, a corresponding endDrag call is guaranteed.
   * You may call monitor.didDrop() to check whether or not the drop was handled by a compatible drop target. If it was handled,
   * and the drop target specified a drop result by returning a plain object from its drop() method, it will be available as
   * monitor.getDropResult(). This method is a good place to fire a Flux action. Note: If the component is unmounted while dragging,
   * component parameter is set to be null.
   */
  end?: (dropResult: DropResult | undefined, monitor: DragSourceMonitor) => void;

  /**
   * Optional.
   * Use it to specify whether the dragging is currently allowed. If you want to always allow it, just omit this method.
   * Specifying it is handy if you'd like to disable dragging based on some predicate over props. Note: You may not call
   * monitor.canDrag() inside this method.
   */
  canDrag?: boolean | ((monitor: DragSourceMonitor) => boolean);

  /**
   * Optional.
   * By default, only the drag source that initiated the drag operation is considered to be dragging. You can
   * override this behavior by defining a custom isDragging method. It might return something like props.id === monitor.getItem().id.
   * Do this if the original component may be unmounted during the dragging and later “resurrected” with a different parent.
   * For example, when moving a card across the lists in a Kanban board, you want it to retain the dragged appearance—even though
   * technically, the component gets unmounted and a different one gets mounted every time you move it to another list.
   *
   * Note: You may not call monitor.isDragging() inside this method.
   */
  isDragging?: (monitor: DragSourceMonitor) => boolean;

  /**
   * Returns an optional class name to be added to the drag source component
   */
  collect?: (monitor: DragSourceMonitor) => string | undefined;
  };

  export type DropProps = {
  /**
   * The kinds of dragItems this dropTarget accepts
   */
  accept: TargetType;

  options?: any;

  /**
   * Optional.
   * Called when a compatible item is dropped on the target. You may either return undefined, or a plain object.
   * If you return an object, it is going to become the drop result and will be available to the drag source in its
   * endDrag method as monitor.getDropResult(). This is useful in case you want to perform different actions
   * depending on which target received the drop. If you have nested drop targets, you can test whether a nested
   * target has already handled drop by checking monitor.didDrop() and monitor.getDropResult(). Both this method and
   * the source's endDrag method are good places to fire Flux actions. This method will not be called if canDrop()
   * is defined and returns false.
   */
  drop?: (
    item: DragObject,
    monitor: DropTargetMonitor,
  ) => DropResult | undefined;
  /**
   * Optional.
   * Called when an item is hovered over the component. You can check monitor.isOver({ shallow: true }) to test whether
   * the hover happens over just the current target, or over a nested one. Unlike drop(), this method will be called even
   * if canDrop() is defined and returns false. You can check monitor.canDrop() to test whether this is the case.
   */
  hover?: (item: DragObject, monitor: DropTargetMonitor) => void;

  /**
   * Optional. Use it to specify whether the drop target is able to accept the item. If you want to always allow it, just
   * omit this method. Specifying it is handy if you'd like to disable dropping based on some predicate over props or
   * monitor.getItem(). Note: You may not call monitor.canDrop() inside this method.
   */
  canDrop?: (item: any, monitor: DropTargetMonitor) => boolean;

  /**
   * Returns an optional class name to be added to the drop target component
   */
  collect?: (monitor: DropTargetMonitor) => string | undefined;
};


export type DecoratorClassDef = (theme: Theme) => any;

type DecoratorsT = {[key: string]: DecoratorDeclaration};

export const DECORATORS: DecoratorsT = {
  BOLD: [
    (_, attr, classes): void => {
      attr.className.push(classes['BOLD.bold']);
    },
    () => ({
      bold: {
        fontWeight: 'bold',
      },
    }),
  ],
  ITALIC: [
    (_, attr, classes) => {
      attr.className.push(classes['ITALIC.italic']);
    },
    () => ({
      italic: {
        fontStyle: 'italic',
      },
    }),
  ],
  SELECT: [ // programatically label a section to be selected
    (_, attr, classes) => {
      attr.className.push(classes['SELECT.select']);
    },
    () => ({
      select: {
        background: '#DEDEDE',
      },
    }),
  ],
  COMMENT: [
    (_, attr, classes) => {
      attr.className.push(classes['COMMENT.comment']);
      attr.refF.push((node) => {
        // const style = getComputedStyle(node);
        // const lineHeight = parseInt(style['line-height']);
        // const off = 20 - lineHeight / 2;
        // const p = node.offsetParent;
        // const pStyle = getComputedStyle(p);
        // const top = node.offsetTop + p.offsetTop - off + 8 ; // 8 ... outter padding
        // console.log("COOOOOOMMENT top:", top, node.offsetTop, p.offsetTop, lineHeight, node);
      });
    },
    () => ({
      comment: {
        background: '#FDF1BD',
      },
      highlighted: {
        background: '#FAE27B',
      },
    }),
  ],
};

export function addDecorator(
  name: string,
  declaration: DecoratorDeclaration,
): void {
  if (DECORATORS[name]) {
    logger.warn(`Overriding previously declared decorator '${name}'.`);
  }
  DECORATORS[name] = declaration;
}

export default (
  editorOpts: EditorOpts,
  decorators: DecoratorsT = DECORATORS,
): DraftDecoratorType => {
  const self = {} as DraftDecoratorType;

  const id2entities = {} as {[key: string]: Immutable.Set<[string, Entity]>};
  const mappers = {} as {[key: string]: DecorationMapper};
  const styles = {} as {[key: string]: DecoratorClassDef};
  Object.entries(decorators).forEach(([name, [mapper, classDef]]) => {
    mappers[name] = mapper;
    if (classDef) {
      styles[name] = classDef;
    }
  });

  const StyledSpan = withStyles((theme) => {
    const cn = Object.entries(styles).reduce((p, [ns, sf]) => {
      const ts = sf(theme);
      return Object.entries(ts).reduce((p2, [k, s]) => {
        p2[`${ns}.${k}`] = s;
        return p2;
      }, p);
    }, {} as {[key: string]: any});
    return cn;
  })((props) => {
    const sp = { ...props, decorators: mappers, editorOpts } as StylesSpanProps;
    return DecoratedSpan(sp);
  });

  self.getDecorations = (
    block: ContentBlock, 
    contentState: ContentState
  ): Immutable.List<string> => block.getCharacterList().map((cm?) => {
    if (!cm) return null;

    const sy = cm.getStyle();
    if (sy.size === 0) return null;

    const sa = sy.toArray();
    const id = sa.sort().join('.');
    const d = id2entities[id] ? id : createDecorator(id, sy, contentState);
    return d;
  }) as Immutable.List<string>;

  const createDecorator = (
    id: string,
    stys: Immutable.OrderedSet<string>,
    contentState: ContentState,
  ): string => {
    const sm = stys.map((k) => {
      if (!k) return null; // shall never happen
      if (mappers[k]) {
        return [k, null];
      }
      try {
        const e = contentState.getEntity(k);
        return [k, e];
      } catch (ex) {
        if (!k.endsWith('_T')) {
          // any entity name ending in '_T' should be ignored
          console.warn(`Missing entity reference '${k}'`, ex);
        }
        return null;
      }
    }).filter((e) => e !== null) as any; // keep type checker happy. Not sure why I need to do this
    const entities = sm as Immutable.Set<[string, Entity]>;
    id2entities[id] = entities;
    return id;
  };

  self.getComponentForKey = () => StyledSpan;

  self.getPropsForKey = (id) => {
    if (!id2entities[id]) {
      console.warn('Requesting props for unknown key', id);
    }
    return { entities: id2entities[id], decoratorID: id };
  };

  return self;
};
