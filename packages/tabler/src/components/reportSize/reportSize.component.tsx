import React, { useEffect, useRef, useState } from 'react';
import { subscribe } from 'subscribe-ui-event';

export type ComponentProps = {
  children: JSX.Element;
  onSizeChange: (ev: SizeEventT) => void;
  throttleRate?: number;
  mui?: {
    className?: string;
    style?: { [k: string]: any };
  }
};

export type SizeEventT = {
  top: number;
  x: number;
  y: number;
  width: number;
  height: number;
  isVisible: boolean;
}

type ComponentT = ComponentProps & {
  // onSomething: (ev: SomeEvent) => void;
};

export const Component = (props: ComponentT) => {
  const {
    children,
    onSizeChange,
    throttleRate = 500,
    mui = {},
    //classes,
  } = props;
  const [pos, setPos] = useState<SizeEventT | undefined>(undefined);
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Called whenver window is scrolled or resized
    function onEvent() {
      const el = elRef.current;
      if (el) {
        const { x, y, width, height } = el.getBoundingClientRect();
        const top = window.innerHeight;
        const isVisible = true; // height > 0;
        const p: SizeEventT = { top, isVisible, x, y, width, height };
        //console.log('>>> SIZE: ', p);

        if (!pos
          || p.top !== pos.top
          || p.x !== pos.x || p.y !== pos.y
          || p.height !== pos.height || p.width !== pos.width
          || isVisible !== pos.isVisible
        ) {
          //console.log('>>> REPORT: ', p);
          onSizeChange(p);
          setPos(p);
        }
      } else {
        setPos(undefined);
      }
    }
    onEvent();
    const s1 = subscribe('scroll', onEvent, { throttleRate });
    const s2 = subscribe('resize', onEvent, { throttleRate });
    return () => {
      s1.unsubscribe();
      s2.unsubscribe();
    };
  }, [throttleRate, onSizeChange, pos]);

  return (
    <div
      ref={elRef}
      className={mui.className || ''}
      style={mui.style || {}}
      data-pihanga-component="report-size"
    >
      {children}
    </div>
  );
}
