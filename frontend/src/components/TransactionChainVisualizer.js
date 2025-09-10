import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import './TransactionChainVisualizer.css';
import { FaSearch, FaSearchMinus, FaSearchPlus, FaNetworkWired, FaTree, FaRedo, FaInfoCircle, FaHandPaper, FaMouse } from 'react-icons/fa';
import { API_BASE_URL, API_KEY } from '../config';

const TransactionChainVisualizer = ({ txHash, initialDepth = 1 }) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [depth, setDepth] = useState(initialDepth);
  const [viewMode, setViewMode] = useState('tree'); // 'tree' or 'network'
  const [zoomLevel, setZoomLevel] = useState(100);
  const gRef = useRef(null);
  const zoomRef = useRef(null);
  
  // Fetch transaction chain data
  useEffect(() => {
    const fetchTransactionChain = async () => {
      if (!txHash) {
        setError("No transaction hash provided");
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/transaction/chain/${txHash}?depth=${depth}&api_key=${API_KEY}`);
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const chainData = await response.json();
        setData(chainData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching transaction chain:', err);
        setError(`Failed to load transaction chain: ${err.message}`);
        setLoading(false);
      }
    };
    
    fetchTransactionChain();
  }, [txHash, depth]);

  // Initialize or update visualization when data or view mode changes
  useEffect(() => {
    if (!data || loading || !svgRef.current) return;
    
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (viewMode === 'tree') {
        renderTreeView();
      } else {
        renderNetworkView();
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [data, loading, viewMode]);

  // Handle depth change
  const handleDepthChange = (e) => {
    const newDepth = parseInt(e.target.value, 10);
    setDepth(newDepth);
  };

  // Toggle view between tree and network
  const toggleView = () => {
    setViewMode(prev => prev === 'tree' ? 'network' : 'tree');
  };

  // Initialize zoom behavior
  const initZoom = () => {
    if (!svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    if (!svg.node()) return;
    
    const g = d3.select(gRef.current);
    if (!g.node()) return;
    
    const zoom = d3.zoom()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        setZoomLevel(Math.round(event.transform.k * 100));
      });
    
    svg.call(zoom);
    zoomRef.current = zoom;
    
    // Center the visualization initially
    try {
      const svgWidth = svg.node().clientWidth || 800;
      const svgHeight = svg.node().clientHeight || 600;
      const initialTransform = d3.zoomIdentity.translate(svgWidth / 2, svgHeight / 2).scale(1);
      svg.call(zoom.transform, initialTransform);
    } catch (err) {
      console.error('Error initializing zoom:', err);
    }
  };

  // Reset zoom to initial state
  const resetZoom = () => {
    const svg = d3.select(svgRef.current);
    if (!svg.node() || !zoomRef.current) return;
    
    const svgWidth = svg.node().clientWidth;
    const svgHeight = svg.node().clientHeight;
    const initialTransform = d3.zoomIdentity.translate(svgWidth / 2, svgHeight / 2).scale(1);
    
    svg.transition().duration(750).call(zoomRef.current.transform, initialTransform);
  };

  // Zoom in function
  const zoomIn = () => {
    const svg = d3.select(svgRef.current);
    if (!svg.node() || !zoomRef.current) return;
    
    svg.transition().duration(300).call(
      zoomRef.current.scaleBy, 1.3
    );
  };

  // Zoom out function
  const zoomOut = () => {
    const svg = d3.select(svgRef.current);
    if (!svg.node() || !zoomRef.current) return;
    
    svg.transition().duration(300).call(
      zoomRef.current.scaleBy, 0.7
    );
  };

  // Filter data to respect depth setting
  const filterDataByDepth = (data, maxDepth) => {
    if (!data) return null;
    
    // For real data, just return as is for now
    // In a real implementation, you would recursively limit the depth
    return data;
  };

  // Render Tree View
  const renderTreeView = () => {
    if (!svgRef.current || !data) return;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    
    const g = svg.append("g");
    gRef.current = g.node();
    
    // Initialize zoom
    initZoom();
    
    // Tree layout setup
    const width = svg.node().clientWidth || 800; // Provide fallback width
    const height = svg.node().clientHeight || 600; // Provide fallback height
    
    const treeData = filterDataByDepth(data, depth);
    
    try {
      const treeLayout = d3.tree()
        .size([height - 100, width - 160])
        .separation((a, b) => (a.parent === b.parent ? 1 : 1.2));
      
      // Create hierarchy - handle errors
      const root = d3.hierarchy(treeData);
      
      // Only proceed if we have valid root data
      if (root) {
        treeLayout(root);
        
        // Links
        g.selectAll(".link")
          .data(root.links())
          .enter()
          .append("path")
          .attr("class", "link")
          .attr("d", d3.linkHorizontal()
            .x(d => d.y)
            .y(d => d.x));
        
        // Nodes
        const nodes = g.selectAll(".node")
          .data(root.descendants())
          .enter()
          .append("g")
          .attr("class", "node")
          .attr("transform", d => `translate(${d.y},${d.x})`);
        
        nodes.append("circle")
          .attr("r", 5)
          .attr("fill", d => d.data.type === 'transaction' ? '#3498db' : '#2ecc71');
        
        nodes.append("text")
          .attr("dy", ".35em")
          .attr("x", d => d.children ? -13 : 13)
          .attr("text-anchor", d => d.children ? "end" : "start")
          .text(d => d.data.label || d.data.id.substring(0, 10) + '...');
      } else {
        console.error("Failed to create hierarchy from data", treeData);
      }
    } catch (err) {
      console.error("Error rendering tree view:", err);
      setError(`Error rendering visualization: ${err.message}`);
    }
  };

  // Render Network View
  const renderNetworkView = () => {
    if (!svgRef.current || !data) return;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    
    const g = svg.append("g");
    gRef.current = g.node();
    
    // Initialize zoom
    initZoom();
    
    try {
      // Network data preparation
      const width = svg.node().clientWidth || 800; // Provide fallback width
      const height = svg.node().clientHeight || 600; // Provide fallback height
      
      const networkData = filterDataByDepth(data, depth);
      
      // Extract nodes and links from your data
      const nodes = networkData.nodes || [];
      const links = networkData.links || [];
      
      if (nodes.length === 0) {
        console.error("No nodes found in data", networkData);
        setError("Visualization data contains no nodes");
        return;
      }
      
      // Force simulation
      const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(100))
        .force("charge", d3.forceManyBody().strength(-300))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide().radius(30));
      
      // Links
      const link = g.selectAll(".network-link")
        .data(links)
        .enter()
        .append("line")
        .attr("class", "network-link");
      
      // Nodes with drag behavior
      const node = g.selectAll(".network-node")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "network-node")
        .call(d3.drag()
          .on("start", function(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", function(event, d) {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", function(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }));
      
      node.append("circle")
        .attr("r", 8)
        .attr("fill", d => d.type === 'transaction' ? '#3498db' : '#2ecc71');
      
      node.append("text")
        .attr("dy", -15)
        .attr("text-anchor", "middle")
        .text(d => d.label || d.id.substring(0, 10) + '...');
      
      // Update positions during simulation
      simulation.on("tick", () => {
        link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);
        
        node.attr("transform", d => `translate(${d.x},${d.y})`);
      });
    } catch (err) {
      console.error("Error rendering network view:", err);
      setError(`Error rendering visualization: ${err.message}`);
    }
  };

  return (
    <div className="transaction-chain-visualizer" ref={containerRef}>
      <div className="visualization-help">
        <div className="help-message">
          <FaInfoCircle /> Use the depth slider to control how many levels of transactions to display.
        </div>
        <div className="help-message">
          <FaHandPaper /> Click and drag to pan the visualization. Use the zoom buttons or mouse wheel to zoom.
        </div>
        <div className="help-message">
          <FaMouse /> Hover over nodes to see more details. Click nodes to select them.
        </div>
      </div>
      
      <div className="visualization-controls">
        <div className="depth-control">
          <label>Trace Depth: {depth}</label>
          <input 
            type="range" 
            min="1" 
            max="5" 
            value={depth} 
            onChange={handleDepthChange}
            className="depth-slider"
          />
        </div>
        
        <div className="view-control">
          <button 
            className={`view-toggle-btn ${viewMode === 'tree' ? 'active' : ''}`} 
            onClick={() => setViewMode('tree')}
            aria-label="Tree View"
          >
            <FaTree /> Tree View
          </button>
          <button 
            className={`view-toggle-btn ${viewMode === 'network' ? 'active' : ''}`} 
            onClick={() => setViewMode('network')}
            aria-label="Network View"
          >
            <FaNetworkWired /> Network View
          </button>
          <button className="zoom-in-btn" onClick={zoomIn} aria-label="Zoom In">
            <FaSearchPlus />
          </button>
          <button className="zoom-out-btn" onClick={zoomOut} aria-label="Zoom Out">
            <FaSearchMinus />
          </button>
          <button className="zoom-reset-btn" onClick={resetZoom} aria-label="Reset Zoom">
            <FaRedo /> Reset
          </button>
          <div className="zoom-level">
            <FaSearch /> {zoomLevel}%
          </div>
        </div>
      </div>
      
      <div className="visualization-legend">
        <div className="legend-item">
          <div className="legend-dot transaction-dot"></div>
          Transaction
        </div>
        <div className="legend-item">
          <div className="legend-dot address-dot"></div>
          Address
        </div>
        <div className="legend-info">
          <FaInfoCircle /> {viewMode === 'tree' ? 'Tree view shows parent-child relationships' : 'Network view shows interconnections'}
        </div>
      </div>
      
      {loading ? (
        <div className="visualization-container">
          <div className="visualization-loading">
            <div className="spinner"></div>
            <p>Loading transaction chain...</p>
          </div>
        </div>
      ) : error ? (
        <div className="visualization-container">
          <div className="visualization-error">
            <p>{error}</p>
            <button 
              onClick={() => {
                window.location.reload();
              }}
              className="btn btn-primary mt-3"
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <div className="visualization-container">
          <svg ref={svgRef} className="transaction-graph" />
        </div>
      )}
      
      <div className="visualization-info">
        {!loading && !error && data && `Showing ${viewMode} visualization for transaction ${txHash} with depth ${depth}`}
      </div>
    </div>
  );
};

export default TransactionChainVisualizer; 