import React, { useState, useRef } from 'react';
import { ForceGraph2D } from 'react-force-graph';
import { forceManyBody, forceCollide } from 'd3-force';
import WithDimensions from './withDimensions.component';
import styled from './network.style';
import useGraph from './useGraph';
import useColorScheme, { defColorScheme } from './useColorScheme';

export const NetworkComponent = styled(({
  data,
  aspectRatio = 3.0 / 4,
  backgroundColor = 'transparent', 
  nodeColorBy = 'group',
  nodeColorTypes = [], // preset the mapping from node types to color
  colorScheme = defColorScheme,
  onNode,
  onLink,
  classes
}) => {
  const graphData = useGraph(data);
  const colors = useColorScheme(colorScheme, nodeColorTypes)
  const [hoverNode, setHoverNode] = useState(null);
  const forceSet = useRef(false);

  function nodeCanvasObject(node, ctx, globalScale) {
    const label = node._node.label || node.id;
    let fontSize = 12 / globalScale;
    if (node.id === hoverNode) {
      fontSize *= 2;
    }
    ctx.font = `${fontSize}px Sans-Serif`;
    const textWidth = ctx.measureText(label).width;
    const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = textColor(node._node);
    ctx.fillText(label, node.x, node.y);
  }

  function textColor(state) {
    let color = 'black';
    if (nodeColorBy) {
      color = colors(state[nodeColorBy], color);
    }
    return color;
  }

  function onNodeClick(node) {
    onNode({node: node._node});
  }

  function onLinkClick(link) {
    onLink({link: link._link});
  }

  function configGraph(g) {
    if (!g) return;
    if (!forceSet.current) {
      // will only come through here once
      const p = g.props;
      const d = Math.min(p.width, p.height);
      const strength = -40;
      g.state.comp.d3Force('charge', forceManyBody().strength(strength).distanceMax(d/3));
      g.state.comp.d3Force('collide', forceCollide(15));
      forceSet.current = true;
    }
  }
    
  function onNodeHover(n) {
    setHoverNode(n != null ? n.id : null);
  }

  return (
    <WithDimensions aspectRatio={aspectRatio} className={classes.outer}>
      <ForceGraph2D
        ref={configGraph}
        // width, height set by enclosing 'WithDimensions'
        graphData={graphData}
        nodeCanvasObject={nodeCanvasObject}
        enableZoomPanInteraction={true}
        backgroundColor={backgroundColor}
        onNodeClick={onNodeClick}
        onNodeHover={onNodeHover}
        onLinkClick={onLinkClick}
      />
    </WithDimensions>
  )
});
