import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import './TransactionGraph.css';

const TransactionGraph = ({ transactionData, width = 800, height = 600 }) => {
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
  const zoomRef = useRef(null);
  const svgElementRef = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);

  useEffect(() => {
    if (!transactionData || !svgRef.current) return;

    // Clear previous graph
    d3.select(svgRef.current).selectAll('*').remove();

    // Process data to convert to D3 format
    const nodes = [];
    const links = [];
    
    // Function to recursively process transaction data
    const processNode = (node, parent = null, depth = 0) => {
      if (!node) return;
      
      // Add node
      const nodeId = `${node.hash}-${depth}`;
      const nodeObj = {
        id: nodeId,
        hash: node.hash,
        time: node.time,
        amount: node.total,
        block: node.block,
        confirmations: node.confirmations || 0,
        visited: node.visited || false,
        loopDetected: node.loopDetected || false,
        depth
      };
      
      nodes.push(nodeObj);
      
      // Add link if there's a parent
      if (parent) {
        links.push({
          source: parent,
          target: nodeId,
          value: 1
        });
      }
      
      // Process children recursively
      if (node.children && node.children.length > 0) {
        node.children.forEach(child => {
          processNode(child, nodeId, depth + 1);
        });
      }
    };
    
    // Start processing from root
    processNode(transactionData);

    // Create the SVG container
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);
    
    // Create a container group for zooming
    const container = svg.append('g');
    
    // Create the tooltip
    const tooltip = d3.select(tooltipRef.current);
    
    // Enhanced force simulation with better positioning
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id)
        .distance(d => {
          const sourceDepth = nodes.find(n => n.id === d.source.id)?.depth || 0;
          const targetDepth = nodes.find(n => n.id === d.target.id)?.depth || 0;
          return 80 + Math.abs(sourceDepth - targetDepth) * 40;
        })
        .strength(0.8))
      .force('charge', d3.forceManyBody()
        .strength(d => d.depth === 0 ? -2000 : -1200)
        .distanceMax(300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(d => d.depth === 0 ? 25 : 18))
      .force('radial', d3.forceRadial(d => d.depth * 120, width / 2, height / 2).strength(0.3));
    
    // Create enhanced links with gradients and animations
    const defs = svg.append('defs');
    
    // Create gradient for links
    const gradient = defs.append('linearGradient')
      .attr('id', 'linkGradient')
      .attr('gradientUnits', 'userSpaceOnUse');
    
    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#3498db')
      .attr('stop-opacity', 0.8);
    
    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#2ecc71')
      .attr('stop-opacity', 0.4);
    
    // Create link markers (arrows)
    defs.append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 20)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 8)
      .attr('markerHeight', 8)
      .attr('xoverflow', 'visible')
      .append('svg:path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', '#3498db')
      .style('stroke', 'none');
    
    const link = container.append('g')
      .attr('class', 'links')
      .selectAll('path')
      .data(links)
      .enter().append('path')
      .attr('class', 'link')
      .attr('stroke', 'url(#linkGradient)')
      .attr('stroke-width', d => {
        const amount = d.source.amount || 0;
        return Math.max(2, Math.min(8, amount / 1e8 * 2));
      })
      .attr('fill', 'none')
      .attr('marker-end', 'url(#arrowhead)')
      .style('opacity', 0.7);
    
    // Create the nodes
    const node = container.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodes)
      .enter().append('g')
      .attr('class', d => {
        let classes = 'node';
        if (d.visited) classes += ' node-visited';
        if (d.loopDetected) classes += ' node-loop';
        if (d.depth === 0) classes += ' node-root';
        return classes;
      })
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));
    
    // Enhanced nodes with multiple gradients for different node types
    const createNodeGradient = (id, innerColor, outerColor) => {
      const gradient = defs.append('radialGradient')
        .attr('id', id)
        .attr('cx', '30%')
        .attr('cy', '30%');
      
      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', '#ffffff')
        .attr('stop-opacity', 0.9);
      
      gradient.append('stop')
        .attr('offset', '30%')
        .attr('stop-color', innerColor)
        .attr('stop-opacity', 0.8);
      
      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', outerColor)
        .attr('stop-opacity', 1);
    };
    
    // Create gradients for different node types
    createNodeGradient('rootGradient', '#2ecc71', '#27ae60');
    createNodeGradient('normalGradient', '#1abc9c', '#16a085');
    createNodeGradient('largeGradient', '#9b59b6', '#8e44ad');
    createNodeGradient('mediumGradient', '#3498db', '#2980b9');
    createNodeGradient('visitedGradient', '#f39c12', '#e67e22');
    createNodeGradient('loopGradient', '#e74c3c', '#c0392b');
    
    // Add glow effect
    const filter = defs.append('filter')
      .attr('id', 'glow');
    
    filter.append('feGaussianBlur')
      .attr('stdDeviation', '3')
      .attr('result', 'coloredBlur');
    
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode')
      .attr('in', 'coloredBlur');
    feMerge.append('feMergeNode')
      .attr('in', 'SourceGraphic');
    
    // Create multi-layer circles for 3D effect with dynamic gradients
    const nodeGroups = node.selectAll('.node-group')
      .data(d => [d])
      .enter()
      .append('g')
      .attr('class', 'node-group');

    // Function to determine gradient based on node properties
    const getNodeGradient = (d) => {
      if (d.depth === 0) return 'url(#rootGradient)';
      if (d.loopDetected) return 'url(#loopGradient)';
      if (d.visited) return 'url(#visitedGradient)';
      if (d.amount > 50000) return 'url(#largeGradient)';
      if (d.amount > 10000) return 'url(#mediumGradient)';
      return 'url(#normalGradient)';
    };

    // Outer glow circle with pulsing animation
    nodeGroups.append('circle')
      .attr('class', 'node-glow')
      .attr('r', d => Math.max(8, Math.min(25, d.amount / 1000)) + 12)
      .attr('fill', d => getNodeGradient(d))
      .attr('opacity', 0.2)
      .style('animation', 'pulse 2s ease-in-out infinite');

    // Shadow circle for depth
    nodeGroups.append('circle')
      .attr('class', 'node-shadow')
      .attr('r', d => Math.max(8, Math.min(25, d.amount / 1000)) + 2)
      .attr('fill', '#000000')
      .attr('opacity', 0.3)
      .attr('cx', 2)
      .attr('cy', 2);

    // Main circle with enhanced styling
    nodeGroups.append('circle')
      .attr('class', 'node-main')
      .attr('r', d => Math.max(8, Math.min(25, d.amount / 1000)))
      .attr('fill', d => getNodeGradient(d))
      .attr('stroke', d => d.depth === 0 ? '#f1c40f' : '#2c3e50')
      .attr('stroke-width', d => d.depth === 0 ? 3 : 2)
      .attr('filter', 'url(#glow)')
      .style('cursor', 'pointer');

    // Inner highlight circle for 3D effect
    nodeGroups.append('circle')
      .attr('class', 'node-highlight')
      .attr('r', d => Math.max(2, Math.min(8, d.amount / 3000)))
      .attr('fill', '#ffffff')
      .attr('opacity', 0.8)
      .attr('cx', -2)
      .attr('cy', -2);

    // Risk indicator ring for high-risk nodes
    nodeGroups.filter(d => d.riskScore > 0.7)
      .append('circle')
      .attr('class', 'risk-ring')
      .attr('r', d => Math.max(8, Math.min(25, d.amount / 1000)) + 6)
      .attr('fill', 'none')
      .attr('stroke', '#e74c3c')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5')
      .style('animation', 'rotate 3s linear infinite');
    
    // Add inner highlight
    node.append('circle')
      .attr('r', d => (d.depth === 0 ? 15 : 10) * 0.3)
      .attr('fill', '#ffffff')
      .attr('opacity', 0.6)
      .attr('cx', -2)
      .attr('cy', -2);
    
    // Add labels to nodes
    node.append('text')
      .attr('dy', -15)
      .attr('text-anchor', 'middle')
      .text(d => `${d.hash.substring(0, 6)}...`)
      .attr('class', 'node-label');
    
    // Add hover interaction
    node.on('mouseover', function(event, d) {
      setHoveredNode(d);
      
      tooltip
        .style('display', 'block')
        .style('left', `${event.pageX + 10}px`)
        .style('top', `${event.pageY - 28}px`)
        .style('transform', 'scale(1)');
    })
    .on('mouseout', function() {
      tooltip.style('display', 'none');
      setHoveredNode(null);
    });
    
    // Add click interaction
    node.on('click', (event, d) => {
      window.open(`https://www.blockchain.com/explorer/transactions/btc/${d.hash}`, '_blank');
    });
    
    // Enhanced tick function with curved links
    simulation.on('tick', () => {
      // Update curved links
      link.attr('d', d => {
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const dr = Math.sqrt(dx * dx + dy * dy) * 0.3;
        return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
      });
      
      // Update node positions with boundary constraints
      node.attr('transform', d => {
        d.x = Math.max(30, Math.min(width - 30, d.x));
        d.y = Math.max(30, Math.min(height - 30, d.y));
        return `translate(${d.x},${d.y})`;
      });
    });
    
    // Drag functions
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    
    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }
    
    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    
    // Enhanced color scheme with risk-based coloring
    function getNodeColor(node) {
      if (node.loopDetected) return '#e74c3c'; // Red for loops
      if (node.visited) return '#f39c12'; // Orange for visited
      if (node.depth === 0) return '#2ecc71'; // Green for root
      
      // Color based on amount and depth
      const amount = Math.abs(node.amount || 0) / 1e8;
      if (amount > 10) return '#9b59b6'; // Purple for large amounts
      if (amount > 1) return '#3498db'; // Blue for medium amounts
      if (node.depth > 3) return '#95a5a6'; // Gray for deep nodes
      return '#1abc9c'; // Teal for normal nodes
    }
    
    // Zoom functionality
    const zoom = d3.zoom()
      .scaleExtent([0.3, 5])
      .on('zoom', (event) => {
        container.attr('transform', event.transform);
      });
    
    svg.call(zoom);
    
    // Store the zoom object and svg in refs for external controls
    zoomRef.current = zoom;
    svgElementRef.current = svg.node();
    
    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [transactionData, width, height]);

  // Zoom control functions
  const handleZoomIn = () => {
    if (zoomRef.current && svgElementRef.current) {
      d3.select(svgElementRef.current)
        .transition()
        .duration(300)
        .call(zoomRef.current.scaleBy, 1.5);
    }
  };
  
  const handleZoomOut = () => {
    if (zoomRef.current && svgElementRef.current) {
      d3.select(svgElementRef.current)
        .transition()
        .duration(300)
        .call(zoomRef.current.scaleBy, 0.75);
    }
  };
  
  const handleResetView = () => {
    if (zoomRef.current && svgElementRef.current) {
      d3.select(svgElementRef.current)
        .transition()
        .duration(500)
        .call(zoomRef.current.transform, d3.zoomIdentity);
    }
  };

  return (
    <div className="transaction-graph-container">
      <div className="graph-controls mb-3">
        <div className="alert alert-info">
          <i className="fas fa-info-circle"></i>
          Drag nodes to reposition. Scroll to zoom. Click a transaction to view details.
        </div>
        <div className="zoom-controls">
          <button className="zoom-btn" onClick={handleZoomIn} title="Zoom In">
            <i className="fas fa-plus"></i>
          </button>
          <button className="zoom-btn" onClick={handleZoomOut} title="Zoom Out">
            <i className="fas fa-minus"></i>
          </button>
          <button className="reset-view-btn" onClick={handleResetView}>
            <i className="fas fa-sync-alt"></i> Reset View
          </button>
        </div>
      </div>
      
      <div className="graph-container">
        <svg ref={svgRef} className="transaction-graph"></svg>
        <div 
          ref={tooltipRef} 
          className="node-tooltip" 
          style={{ display: 'none' }}
        >
          {hoveredNode && (
            <div className="tooltip-content">
              <div className="tooltip-hash">{hoveredNode.hash}</div>
              <div className="tooltip-details">
                {hoveredNode.time && (
                  <div className="tooltip-time">
                    {new Date(hoveredNode.time).toLocaleString()}
                  </div>
                )}
                <div className="tooltip-amount">
                  {hoveredNode.amount ? `${(hoveredNode.amount / 1e8).toFixed(8)} BTC` : 'Unknown amount'}
                </div>
                {hoveredNode.block && (
                  <div className="tooltip-block">
                    Block: {hoveredNode.block}
                  </div>
                )}
                {hoveredNode.confirmations > 0 && (
                  <div className="tooltip-confirmations">
                    Confirmations: {hoveredNode.confirmations}
                  </div>
                )}
                {hoveredNode.loopDetected && (
                  <div className="tooltip-warning">
                    Loop detected in transaction chain
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="graph-legend mt-3">
        <div className="legend-item">
          <div className="legend-color root-node"></div>
          <div className="legend-label">Root Transaction</div>
        </div>
        <div className="legend-item">
          <div className="legend-color normal-node"></div>
          <div className="legend-label">Transaction</div>
        </div>
        <div className="legend-item">
          <div className="legend-color visited-node"></div>
          <div className="legend-label">Visited Transaction</div>
        </div>
        <div className="legend-item">
          <div className="legend-color loop-node"></div>
          <div className="legend-label">Loop Transaction</div>
        </div>
      </div>
    </div>
  );
};

export default TransactionGraph; 