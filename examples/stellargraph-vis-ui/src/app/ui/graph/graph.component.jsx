import React from 'react';
import CytoscapeComponent from 'react-cytoscapejs';

const elements = [
  { data: { id: 'one', label: 'Node 1' }, position: { x: 0, y: 0 } },
  { data: { id: 'two', label: 'Node 2' }, position: { x: 100, y: 0 } },
  { data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2' } },
];

export const GraphComponent = () => (
  <div className="bg-white mx-auto max-w-sm shadow-lg rounded-lg overflow-hidden">
    <div className="sm:flex sm:items-center px-6 py-4">
      <img
        className="block h-16 sm:h-24 rounded-full mx-auto mb-4 sm:mb-0 sm:mr-4 sm:ml-0"
        src="data61-logo.png"
        alt=""
      />

      <CytoscapeComponent
        elements={elements}
        style={{ width: '600px', height: '600px' }}
      />
    </div>
  </div>
);
