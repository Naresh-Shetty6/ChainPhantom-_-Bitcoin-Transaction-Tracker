import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import './TransactionGraph.css';

const TransactionGraph = ({ transactionData, width = 800, height = 600 }) => {
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
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
    
    // Set up the force simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-800))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('x', d3.forceX(width / 2).strength(0.1))
      .force('y', d3.forceY(height / 2).strength(0.1));
    
    // Create the links
    const link = container.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('class', 'link')
      .attr('stroke-width', 2);
    
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
    
    // Add circles to nodes
    node.append('circle')
      .attr('r', d => d.depth === 0 ? 15 : 10)
      .attr('fill', d => getNodeColor(d))
      .attr('stroke', d => {
        if (d.loopDetected) return '#f39c12';
        if (d.visited) return '#e74c3c';
        return '#1d3351';
      })
      .attr('stroke-width', d => {
        if (d.loopDetected || d.visited) return 3;
        return 1;
      });
    
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
    
    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
      
      node
        .attr('transform', d => `translate(${d.x},${d.y})`);
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
    
    // Helper function to determine node color
    function getNodeColor(node) {
      if (node.loopDetected) return 'rgba(243, 156, 18, 0.8)';
      if (node.visited) return 'rgba(231, 76, 60, 0.8)';
      if (node.depth === 0) return '#00a8ff';
      return '#3498db';
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

  // Add refs for zoom controls
  const zoomRef = useRef(null);
  const svgElementRef = useRef(null);
  
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