import { useDrag, useDrop } from 'react-dnd';
import React = require('react');
import {ContentState, DraftEntityType, DraftEntityMutability} from 'draft-js';
import {DecorationMapper, ParentProps, ElementProps, DropProps, DragProps, EditorOpts} from './decorator';

// type ClassedProps<P> = P & { 
//   classes: {[name:string]:string}, 
//   children?: React.ReactNode 
// };

// this is identical to 'DraftEntityInstance' which is unfortunately not exported
interface Entity {
  getType(): DraftEntityType,
  getMutability(): DraftEntityMutability,
  getData(): Object,
}

type DragElProps = {
  dragOpts: DragProps, 
  el: string, 
  elProps: {className?: string} & {[key:string]:any},
};

type DropElProps = {
  dropOpts: DropProps, 
  el: string, 
  elProps: {className?: string} & {[key:string]:any},
};

export type StylesSpanProps = ClassedProps<ParentProps & {
  contentState: ContentState,
  decoratedText: string
  start: number,
  end: number,
  blockKey: string,
  entityKey: string | undefined,
  // classes: {[key:string]:string},

  editorOpts: EditorOpts,
  decorators: {[key:string]:DecorationMapper},
  entities?: [string, Entity][],
  decoratorID?: string,
}>;

const StyledSpan = (
  props: ClassedProps<StylesSpanProps>
) => {
  const {
    entities,
    decoratorID,
    contentState,
    decorators,
    editorOpts,
    children,
    classes,
  } = props;

  let attrs = {
    className: [],
    props: {},
    refF: [],
  } as ElementProps;
  if (entities) {
    attrs = entities.reduce((p, [ek, e]) => {
      const t = e.getType();
      const dec = decorators[t];
      if (dec) {
        dec(e, p, classes, contentState, ek, editorOpts, props)
      }
      return p;
    }, attrs);
  }
  const elProps = attrs.props;
  if (attrs.className.length > 0) {
    elProps.className = attrs.className.join(' ');
  }
  if (attrs.refF.length > 0) {
    elProps.ref = (el:any) => {
      if (el) {
        attrs.refF.forEach(f => f(el));
      }
    }
  }
  if (attrs.onClick) {
    elProps.onClick = attrs.onClick;
  }
  elProps['data-decorated'] = decoratorID;
  const el = attrs.element || 'span';
  if (attrs.useDrag) {
    return (
      <DraggableStyledSpan
        dragOpts={attrs.useDrag}
        el={el}
        elProps={elProps}
        classes={classes}
        // eslint-disable-next-line react/no-children-prop
        children={children}
      />
    );
  } else if (attrs.useDrop) {
    return (
      <DropableStyledSpan
        dropOpts={attrs.useDrop}
        el={el} 
        elProps={elProps}
        classes={classes}
        // eslint-disable-next-line react/no-children-prop
        children={children}
      />
    );
  } else {
    return React.createElement(el, elProps, children);
  }
};

const DraggableStyledSpan = (props: ClassedProps<DragElProps>) => {
  const {
    dragOpts, el, elProps, classes, children,
  } = props;
  const [dragClass, drag] = useDrag(dragOpts);

  const ep = { ...elProps, ref: drag };
  const extraClass = classes[dragClass as string];
  if (extraClass) {
    ep.className = `${ep.className ? ep.className : ''} ${extraClass}`;
  }
  return React.createElement(el, ep, children);
};

const DropableStyledSpan = (props: ClassedProps<DropElProps>) => {
  const {
    dropOpts, el, elProps, classes, children,
  } = props;
//    = ({
//   dropOpts, el, elProps, classes, children,
// }) => {
  const [dropClass, drop] = useDrop({
    // accept: ItemTypes.KNIGHT,  // REQUIRED
    drop: (item, monitor) => console.log('ITEM dropped', item, monitor),
    // hover: (item, monitor) => ...
    // canDrop: (item, monitor) => ...
    // collect: (monitor, props) => ...
    ...dropOpts,
  });

  const ep = { ...elProps, ref: drop };
  const extraClass = classes[dropClass as string];
  if (extraClass) {
    ep.className = `${ep.className ? ep.className : ''} ${extraClass}`;
  }
  return React.createElement(el, ep, children);
};

export default StyledSpan;
