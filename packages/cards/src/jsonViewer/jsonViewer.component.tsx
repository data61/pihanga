import React, { useLayoutEffect, useRef } from 'react';
import { PiCardSimpleProps } from '@pihanga/core';
import ReactJson, { ReactJsonViewProps, ThemeKeys } from 'react-json-view';
export type ComponentProps = {
  source: any;
  theme?: ThemeKeys;
  iconStyle?: 'circle' | 'triangle' | 'square';
  // When set to true, objects and arrays are labeled with size
  displayObjectSize?: boolean;
  // When set to true, data type labels prefix values
  displayDataTypes?: boolean;
  // When set, called before json is rendered to the browser
  modifyFn?: ModifyFn;
};

export type ModifyFn = (source: any, el: HTMLElement | null) => void;

// export type SomeEvent = {
//   something: string;
// };

type ComponentT = ComponentProps & {
  // onSomething: (ev: SomeEvent) => void;
};

export const Component = (props: PiCardSimpleProps<ComponentT>) => {
  const {
    source,
    theme,
    iconStyle,
    displayObjectSize = false,
    displayDataTypes = false,
    modifyFn,
    cardName,
  } = props;
  const elRef = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    if (modifyFn) {
      modifyFn(source, elRef.current)
    }
  }, [modifyFn, source])

  const p = {
    src: source,
    theme,
    iconStyle,
    displayObjectSize,
    displayDataTypes,
  } as ReactJsonViewProps;

  // function renderJson() {
  //   const el = React.createElement(ReactJson, p)
  //   el.
  //   return el;
  // }

  return (
    <div className={`pi-json-viewer pi-json-viewer-${cardName}`} ref={elRef} data-pihanga={cardName}  >
      {/* <ReactJson  {...p} />  not sure why this is no longer working */}
      {React.createElement(ReactJson, p)}
    </div>
  );
}

// function visit(_: any, el: HTMLElement | null) {
//   if (!el) return

//   const nodeList = el.querySelectorAll("span.string-value")
//   for (let i = 0; i < nodeList.length; i++) {
//     const node = nodeList[i] as HTMLSpanElement
//     const text = node.innerText
//     if (text.startsWith("\"urn:ivcap")) {
//       console.log(">>> NODE ", text, node)

//       const link = document.createElement('button');
//       link.classList.add('link-value', 'ivcap-link-value');
//       link.innerHTML = text;
//       link.onclick = () => {
//         console.log(`event on button; ${text}`);
//       }
//       node.parentNode?.replaceChild(link, node);

//     }
//   }

//   // //console.log(">>>CHILD", el.nodeName, el.classList.contains('string-value'))
//   // if (el.nodeName === 'SPAN') { // } && el.classList.contains('string-value')) {
//   //   console.log(">>> StRING SPAN ", el.classList)
//   //   console.log(">>> StRING SPAN ", el.classList.contains('string-value'))
//   // }
//   // const cl = el.children
//   // for (let i = 0; i < cl.length; i++) {
//   //   const child = el.children.item(i)
//   //   visit(child)
//   // }
// }
