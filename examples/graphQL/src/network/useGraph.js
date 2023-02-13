import { useState, useRef } from 'react';

// Keep a local copy of all nodes in 'inNodes' in 'nodes'
function syncNodes(inNodes, nodes) {
  let changed = false;
  // Add all new nodes
  inNodes.forEach((n) => {
    let ni = nodes[n.id];
    if (!ni) {
      ni = nodes[n.id] = {id: n.id, _node: n};
      changed = true;
    } else if (ni._node !== n) {
      ni._node = n; // node state has changed
      changed = true; 
    }
    ni._active = true;
  });
  // Remove all nodes no longer in data.nodes
  Object.values(nodes).forEach((n) => {
    if (n._active) {
      n._active = false;
    } else {
      delete nodes[n.id];
      changed = true;
    }
  });
  return changed;
}

// Keep a local copy of all links in 'inLinks' in 'links'
function syncLinks(inLinks, links, nodes) {
  let changed = false;
  // Add all new links
  inLinks.forEach((l) => {
    const id = `${l.source}:${l.target}`
    let ll = links[id];
    if (!ll) {
      // ensure that both nodes exist
      if (nodes[l.source] && nodes[l.target]) {
        ll = links[id] = {
          id, 
          source: l.source, target: l.target, 
          _link: l
        };
        changed = true;
      }
    } else if (ll._link !== l) {
      ll._link = l; // link state has changed
      changed = true; 
    }
    if (ll) {
      ll._active = true;
    }
  });
  // Remove all nodes no longer in data.nodes
  Object.values(links).forEach((l) => {
    if (l._active) {
      l._active = false;
    } else {
      delete links[l.id];
      changed = true;
    }
  });
  return changed;
}

/**
 * Maintain a local copy of a graph description.
 * 
 * @param {{nodes: [], links: []}} data 
 */
export default function useGraph(data) {
  const [nodes] = useState({});
  const [links] = useState({});
  // const [graphData, setGraphData] = useState({nodes: [], links: []});
  const graphData = useRef({nodes: [], links: []}); // avoid re-rendering

  const nf = syncNodes(data.nodes, nodes);
  const lf = syncLinks(data.links, links, nodes);
  if (nf || lf) {
    graphData.current = {nodes: Object.values(nodes), links: Object.values(links)};
  }
  return graphData.current;
}
