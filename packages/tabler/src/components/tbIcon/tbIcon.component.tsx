import React from 'react';
import { IconPlus, Icon } from '@tabler/icons-react';

export type ComponentProps = {
  iconName?: string;
  iconStyle?: React.CSSProperties;
};

type ComponentT = ComponentProps & {
  // onSomething: (ev: SomeEvent) => void;
};

const TablerIcons: { [key: string]: Icon | undefined } = {
  // plus1: (
  //   <>
  //     <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
  //     <path d="M12 5l0 14"></path>
  //     <path d="M5 12l14 0"></path>
  //   </>),
  plus: IconPlus,
}

export function registerTbIcon(name: string, el: Icon) {
  TablerIcons[name] = el
}

export const Component = (props: ComponentT) => {
  const {
    iconName,
    iconStyle = {},
  } = props;

  function renderIcon() {
    if (iconName) {
      const svg = TablerIcons[iconName]
      if (svg) {
        return React.createElement(svg, { style: iconStyle })
      } else {
        throw Error(`tbButton: Unknown svg icon ${iconName}`)
      }
    }
    return null;
  }

  return (
    <>{renderIcon()}</>
  )
}
