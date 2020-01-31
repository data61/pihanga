import { Theme } from "@material-ui/core";

const DragIndicator = {
  d: "M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
};

function icon(path: {[d:string]:string}, strokeColor: string) {
  const content = `<path stroke="${strokeColor}" d="${path.d}" />`
  const viewBox = '4 0 20 25';
  const svg = `<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">${content}</svg>`;
  const data = `data:image/svg+xml;charset=utf-8,${svg}`;
  return encodeURI(data);;
}

export default (theme: Theme) => ({
  link: {
    cursor: 'default',
    color: 'rgb(17,85,204)', //'#1155cc',

  },

  'link.draggable': {
    background: `white url('${icon(DragIndicator, 'rgb(60,112,204)')}') left no-repeat;`,
    paddingLeft: '14px',
  },

  'link.dragging': {
    color: 'red',
  }
});
