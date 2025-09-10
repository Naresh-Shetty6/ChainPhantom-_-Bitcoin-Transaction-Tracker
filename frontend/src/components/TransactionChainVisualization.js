import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faInfoCircle, faSearch, 
  faRedo, faTree, faNetworkWired,
  faSitemap, faProjectDiagram, faSearchPlus,
  faSearchMinus,
  faSync, faFilePdf, faDownload
} from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './TransactionChainVisualizer.css';

const TransactionChainVisualization = ({ 
  relatedTransactions, 
  isLoading,
  onNodeClick,
  traceDepth,
  onDepthChange,
  onExportPDF
}) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [tooltip, setTooltip] = useState({ visible: false, content: '', x: 0, y: 0 });
  const [zoom, setZoom] = useState(100);
  const [viewMode, setViewMode] = useState('tree'); // 'tree' or 'network'
  const [isExporting, setIsExporting] = useState(false);
  
  // Create the visualization
  useEffect(() => {
    if (!relatedTransactions || relatedTransactions.length === 0 || isLoading) return;
    
    const width = containerRef.current.clientWidth;
    const height = 350; // Fixed height to match our container 
    
    // Clear previous SVG content
    d3.select(svgRef.current).selectAll("*").remove();
    
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("class", "transaction-graph");
    
    // Create a group for zoom/pan
    const g = svg.append("g")
      .attr("class", "everything");
    
    // Tree layout - similar to the provided image
    let nodes = [];
    
    // Get main transaction (sample transaction)
    const mainNode = relatedTransactions.find(node => node.main);
    
    if (viewMode === 'tree') {
      // Tree-like layout with Sample Transaction on left, others on right
      if (mainNode) {
        // Place main node on the left side
        mainNode.x = width * 0.15;
        mainNode.y = height * 0.5;
      }
      
      // Create nodes layout similar to the image
      nodes = relatedTransactions.map(tx => {
        // For main node, use the position we already set
        if (tx.main) {
          return {
            id: tx.id,
            type: tx.type,
            hash: tx.hash,
            x: width * 0.15, // Keep horizontal position
            y: height * 0.5, // Center vertically
            main: true
          };
        }
        
        // For intermediate nodes (addresses), position them in the middle
        if (tx.type === 'address') {
          const centerX = width * 0.5;
          
          // Count addresses to better distribute them
          const addressCount = relatedTransactions.filter(n => n.type === 'address').length;
          const addressIndex = relatedTransactions.filter(n => n.type === 'address').indexOf(tx);
          
          // Calculate vertical position based on index for even distribution
          const verticalPadding = height * 0.2; // 20% padding from top and bottom
          const availableHeight = height - (verticalPadding * 2);
          const step = addressCount > 1 ? availableHeight / (addressCount - 1) : 0;
          const yPos = verticalPadding + (addressIndex * step);
          
          return {
            id: tx.id,
            type: tx.type,
            hash: tx.hash,
            x: centerX,
            y: yPos,
            main: false
          };
        }
        
        // For transaction nodes on the right
        if (tx.type === 'transaction' && !tx.main) {
          const rightX = width * 0.85;
          
          // Count transactions to better distribute them
          const txCount = relatedTransactions.filter(n => n.type === 'transaction' && !n.main).length;
          const txIndex = relatedTransactions.filter(n => n.type === 'transaction' && !n.main).indexOf(tx);
          
          // Calculate vertical position based on index for even distribution
          const verticalPadding = height * 0.2; // 20% padding from top and bottom
          const availableHeight = height - (verticalPadding * 2);
          const step = txCount > 1 ? availableHeight / (txCount - 1) : 0;
          const yPos = verticalPadding + (txIndex * step);
          
          return {
            id: tx.id,
            type: tx.type,
            hash: tx.hash,
            x: rightX,
            y: yPos,
            main: false,
            label: `Transaction ${txIndex + 1}`
          };
        }
        
        // Default fallback position
        return {
          id: tx.id,
          type: tx.type,
          hash: tx.hash,
          x: width * 0.5,
          y: height * 0.5,
          main: false
        };
      });
    } else {
      // Network view - force-directed
      const simulation = d3.forceSimulation(relatedTransactions.map(tx => ({
        id: tx.id,
        type: tx.type,
        hash: tx.hash,
        main: tx.main || false
      })))
        .force("link", d3.forceLink().id(d => d.id).distance(100))
        .force("charge", d3.forceManyBody().strength(-300))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("x", d3.forceX(width / 2).strength(0.1))
        .force("y", d3.forceY(height / 2).strength(0.1))
        .force("collision", d3.forceCollide().radius(30));
      
      // Run simulation
      for (let i = 0; i < 300; ++i) simulation.tick();
      
      nodes = simulation.nodes().map(node => {
        // Make sure nodes are within bounds
        node.x = Math.max(30, Math.min(width - 30, node.x));
        node.y = Math.max(30, Math.min(height - 30, node.y));
        
        // Add a label for main node
        if (node.main) {
          node.label = "Main Transaction";
        } else if (node.type === 'transaction') {
          // Find index of this transaction among all transactions that aren't main
          const index = relatedTransactions
            .filter(n => n.type === 'transaction' && !n.main)
            .findIndex(n => n.id === node.id);
          node.label = `Transaction ${index + 1}`;
        }
        
        return node;
      });
    }
    
    // Compute links between nodes similar to image
    const links = [];
    
    if (viewMode === 'tree') {
      // Direct links from main node to addresses and from addresses to transactions
      if (mainNode) {
        const addressNodes = nodes.filter(node => node.type === 'address');
        const transactionNodes = nodes.filter(node => node.type === 'transaction' && !node.main);
        
        // Connect main node to each address
        addressNodes.forEach(addressNode => {
          links.push({
            source: nodes.find(n => n.id === mainNode.id),
            target: addressNode,
            type: 'output'
          });
        });
        
        // Connect each address to a transaction
        addressNodes.forEach((addressNode, idx) => {
          // Make sure we don't exceed the number of transaction nodes
          if (idx < transactionNodes.length) {
            links.push({
              source: addressNode,
              target: transactionNodes[idx],
              type: 'output'
            });
          }
        });
      }
    } else {
      // For network view, create more meaningful connections
      const mainNode = nodes.find(node => node.main);
      
      if (mainNode) {
        // First, connect main node to all addresses
        const addressNodes = nodes.filter(node => node.type === 'address');
        addressNodes.forEach(addressNode => {
          links.push({
            source: mainNode,
            target: addressNode,
            type: 'output',
            value: 2 // thicker line for main connections
          });
        });
        
        // Then connect addresses to transactions
        const transactionNodes = nodes.filter(node => node.type === 'transaction' && !node.main);
        
        // Distribute transactions among addresses more evenly
        addressNodes.forEach((addressNode, addrIndex) => {
          // Calculate which transactions this address should connect to
          transactionNodes.forEach((txNode, txIndex) => {
            // Connect based on patterns to create interesting network
            if ((addrIndex + txIndex) % addressNodes.length === 0 || 
                txIndex % (addrIndex + 1) === 0 || 
                addrIndex === txIndex) {
              links.push({
                source: addressNode,
                target: txNode,
                type: 'output',
                value: 1
              });
            }
          });
        });
        
        // Add some cross-connections between transactions for a more complex network
        if (transactionNodes.length > 1) {
          for (let i = 0; i < transactionNodes.length - 1; i++) {
            links.push({
              source: transactionNodes[i],
              target: transactionNodes[(i + 2) % transactionNodes.length],
              type: 'related',
              value: 0.5 // thinner line for secondary connections
            });
          }
        }
      } else {
        // If no main node, use the original link generation logic
        relatedTransactions.forEach(tx => {
          if (tx.inputs) {
            tx.inputs.forEach(input => {
              const source = nodes.find(node => node.id === input);
              const target = nodes.find(node => node.id === tx.id);
              if (source && target) {
                links.push({
                  source,
                  target,
                  type: 'input',
                  value: 1
                });
              }
            });
          }
          
          if (tx.outputs) {
            tx.outputs.forEach(output => {
              const source = nodes.find(node => node.id === tx.id);
              const target = nodes.find(node => node.id === output);
              if (source && target) {
                links.push({
                  source,
                  target,
                  type: 'output',
                  value: 1
                });
              }
            });
          }
        });
      }
    }
    
    // Add links - curved paths like in the image
    g.selectAll(".tx-path")
      .data(links)
      .enter()
      .append("path")
      .attr("class", d => `tx-path ${viewMode === 'network' ? 'network-path' : ''}`)
      .attr("d", d => {
        if (viewMode === 'network') {
          // Straighter lines for network view
          const dx = d.target.x - d.source.x;
          const dy = d.target.y - d.source.y;
          const dr = Math.sqrt(dx * dx + dy * dy) * 1.2;
          return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
        } else {
          // Enhanced path for tree view - more elegant curve
          const dx = d.target.x - d.source.x;
          const dy = d.target.y - d.source.y;
          
          // Use cubic bezier curve for smoother connections
          const controlPointX1 = d.source.x + dx * 0.5;
          const controlPointY1 = d.source.y;
          const controlPointX2 = d.target.x - dx * 0.5;
          const controlPointY2 = d.target.y;
          
          return `M${d.source.x},${d.source.y} C${controlPointX1},${controlPointY1} ${controlPointX2},${controlPointY2} ${d.target.x},${d.target.y}`;
        }
      })
      .attr("stroke", d => viewMode === 'network' ? "#4a9fff" : "#4a9fff")
      .attr("stroke-width", d => {
        if (viewMode === 'network') {
          return d.value ? d.value * 1.5 : 2;
        } else {
          return 1.5;
        }
      })
      .attr("fill", "none")
      .attr("opacity", d => {
        if (viewMode === 'network') {
          return d.type === 'related' ? 0.5 : 0.7;
        } else {
          return 0.9;
        }
      })
      .attr("marker-end", d => viewMode === 'network' ? "url(#arrowhead)" : null)
      .on("mouseover", (event, d) => {
        setTooltip({
          visible: true,
          content: `${d.source.hash.substring(0, 8)}... → ${d.target.hash.substring(0, 8)}...`,
          x: event.pageX,
          y: event.pageY
        });
      })
      .on("mouseout", () => {
        setTooltip({ visible: false, content: '', x: 0, y: 0 });
      });
    
    // Define arrow marker for network view
    if (viewMode === 'network') {
      svg.append("defs").append("marker")
        .attr("id", "arrowhead")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 20)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", "#4a9fff");
    }
    
    // Add transaction nodes
    const nodeGroups = g.selectAll(".node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", d => `tx-node ${viewMode === 'network' ? 'network-node' : ''}`)
      .attr("transform", d => `translate(${d.x}, ${d.y})`)
      .on("click", (event, d) => {
        if (onNodeClick) {
          onNodeClick(d);
        }
      })
      .on("mouseover", (event, d) => {
        setTooltip({
          visible: true,
          content: d.label || (d.type === 'transaction' ? 'TX: ' : 'Address: ') + d.hash,
          x: event.pageX,
          y: event.pageY
        });
      })
      .on("mouseout", () => {
        setTooltip({ visible: false, content: '', x: 0, y: 0 });
      });
    
    // Add circles for node backgrounds
    nodeGroups.append("circle")
      .attr("r", d => {
        if (viewMode === 'network') {
          return d.main ? 10 : (d.type === 'transaction' ? 8 : 6);
        } else {
          return d.main ? 7 : 5;
        }
      })
      .attr("class", d => {
        let classes = "tx-node-" + d.type;
        if (d.main) classes += " tx-node-main";
        return classes;
      });
    
    // Add text labels for transactions
    nodeGroups.filter(d => d.main || d.label)
      .append("text")
      .attr("dy", d => viewMode === 'network' ? -12 : -8)
      .attr("text-anchor", "middle")
      .attr("fill", "#fff")
      .attr("font-size", viewMode === 'network' ? "10px" : "9px")
      .attr("font-family", "monospace")
      .text(d => d.label || "");
    
    // Add hash text for network view
    if (viewMode === 'network') {
      nodeGroups.filter(d => d.type === 'transaction')
        .append("text")
        .attr("dy", 20)
        .attr("text-anchor", "middle")
        .attr("fill", "#aaa")
        .attr("font-size", "8px")
        .attr("font-family", "monospace")
        .text(d => d.hash.substring(0, 10) + "...");
    }
    
    // Define zoom behavior
    const zoomBehavior = d3.zoom()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
        const newZoomLevel = Math.round(event.transform.k * 100);
        setZoom(newZoomLevel);
      });
    
    svg.call(zoomBehavior);
    
    // Properly center and scale the visualization
    const bounds = g.node().getBBox();
    const centerX = width / 2 - (bounds.x + bounds.width / 2);
    const centerY = height / 2 - (bounds.y + bounds.height / 2);
    const scale = Math.min(0.9, width / bounds.width, height / bounds.height);
    
    // Store the initial transform for reset
    const initialTransform = d3.zoomIdentity.translate(centerX, centerY).scale(scale);
    
    svg.call(
      zoomBehavior.transform,
      initialTransform
    );
    
  }, [relatedTransactions, isLoading, onNodeClick, viewMode]);

  // Helper function for manual zooming
  const applyManualZoom = (newScale, duration = 300) => {
    try {
      const svg = d3.select(svgRef.current);
      const g = svg.select(".everything");
      
      if (!g.node()) {
        console.error("SVG group not found");
        return;
      }
      
      // Get the current transform or create a new one
      let currentTransform;
      try {
        currentTransform = d3.zoomTransform(svg.node());
      } catch (error) {
        console.log("Creating new transform");
        currentTransform = d3.zoomIdentity;
      }
      
      // Create new transform with the specified scale
      const scaledTransform = d3.zoomIdentity
        .translate(currentTransform.x, currentTransform.y)
        .scale(newScale);
      
      // Apply the transform
      g.transition()
        .duration(duration)
        .attr("transform", scaledTransform);
      
      // Update the zoom state
      setZoom(Math.round(newScale * 100));
    } catch (error) {
      console.error("Error applying manual zoom:", error);
    }
  };

  // Zoom handlers
  const handleZoomIn = () => {
    try {
      const svg = d3.select(svgRef.current);
      let currentTransform;
      
      try {
        currentTransform = d3.zoomTransform(svg.node());
      } catch (error) {
        currentTransform = d3.zoomIdentity;
      }
      
      const newScale = Math.min(currentTransform.k * 1.3, 4);
      applyManualZoom(newScale);
    } catch (error) {
      console.error("Error zooming in:", error);
    }
  };
  
  const handleZoomOut = () => {
    try {
      const svg = d3.select(svgRef.current);
      let currentTransform;
      
      try {
        currentTransform = d3.zoomTransform(svg.node());
      } catch (error) {
        currentTransform = d3.zoomIdentity;
      }
      
      const newScale = Math.max(currentTransform.k * 0.7, 0.1);
      applyManualZoom(newScale);
    } catch (error) {
      console.error("Error zooming out:", error);
    }
  };
  
  const handleResetZoom = () => {
    try {
      const svg = d3.select(svgRef.current);
      const g = svg.select(".everything");
      
      if (!g.node()) {
        console.error("SVG group not found");
        return;
      }
      
      // Get the bounds of the visualization
      const bounds = g.node().getBBox();
      
      // Get container dimensions
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = 350; // Fixed height to match our container
      
      // Calculate scale to fit content
      const scale = 0.9 * Math.min(
        containerWidth / bounds.width,
        containerHeight / bounds.height
      );
      
      // Calculate translation to center content
      const translateX = containerWidth / 2 - scale * (bounds.x + bounds.width / 2);
      const translateY = containerHeight / 2 - scale * (bounds.y + bounds.height / 2);
      
      // Create and apply the new transform
      const resetTransform = d3.zoomIdentity
        .translate(translateX, translateY)
        .scale(scale);
      
      g.transition()
        .duration(500)
        .attr("transform", resetTransform);
      
      // Update the zoom state
      setZoom(Math.round(scale * 100));
    } catch (error) {
      console.error("Error resetting zoom:", error);
      // Fallback to simple reset
      try {
        const svg = d3.select(svgRef.current);
        const g = svg.select(".everything");
        
        if (g.node()) {
          g.transition()
            .duration(500)
            .attr("transform", "translate(0,0) scale(1)");
          setZoom(100);
        }
      } catch (innerError) {
        console.error("Fallback reset failed:", innerError);
      }
    }
  };
  
  // Handle depth change without page refresh
  const handleDepthChange = (e) => {
    // Prevent the default browser behavior
    e.preventDefault();
    e.stopPropagation();
    
    // Get the value as a number
    const newDepth = parseInt(e.target.value, 10);
    
    // Call the callback if provided
    if (onDepthChange) {
      onDepthChange(newDepth);
    }
    
    // Return false to prevent any form submission
    return false;
  };

  // Handle export to PDF - Minimal version without visualization
  const handleExportPDF = () => {
    try {
      setIsExporting(true);
      
      // Create a simple PDF with just transaction details
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 15;
      
      // Add title and header
      pdf.setFontSize(18);
      pdf.setTextColor(0, 0, 0);
      pdf.text("ChainPhantom Transaction Report", margin, margin + 5);
      
      // Add metadata section
      pdf.setFontSize(11);
      pdf.text(`Generated: ${new Date().toLocaleString()}`, margin, margin + 15);
      pdf.text(`View mode: ${viewMode}`, margin, margin + 22);
      pdf.text(`Trace depth: ${traceDepth}`, margin, margin + 29);
      
      // Add transaction information
      pdf.setFontSize(14);
      pdf.text("Transaction Details", margin, margin + 40);
      
      let yPosition = margin + 50;
      
      if (relatedTransactions && relatedTransactions.length > 0) {
        // Find main transaction first
        const mainTx = relatedTransactions.find(tx => tx.main);
        if (mainTx) {
          pdf.setFontSize(12);
          pdf.setTextColor(0, 0, 150);
          pdf.text("Main Transaction:", margin, yPosition);
          pdf.setTextColor(0, 0, 0);
          pdf.setFontSize(10);
          pdf.text(mainTx.hash || "Unknown hash", margin, yPosition + 6);
          pdf.text(`Type: ${mainTx.type || "Unknown type"}`, margin, yPosition + 12);
          yPosition += 20;
        }
        
        // Add a divider line
        pdf.setDrawColor(200, 200, 200);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 10;
        
        // List all transactions
        pdf.setFontSize(12);
        pdf.text("All Related Transactions:", margin, yPosition);
        yPosition += 8;
        
        // Filter only transaction nodes
        const transactions = relatedTransactions.filter(node => node.type === 'transaction');
        
        transactions.forEach((tx, i) => {
          // Check if we need a new page
          if (yPosition > 250) {
            pdf.addPage();
            yPosition = margin + 10;
          }
          
          pdf.setFontSize(10);
          pdf.setTextColor(0, 0, 0);
          const label = `Transaction ${i+1}${tx.main ? ' (Main)' : ''}`;
          pdf.text(label, margin, yPosition);
          pdf.setFontSize(8);
          pdf.text(`Hash: ${tx.hash || "Unknown"}`, margin + 5, yPosition + 5);
          yPosition += 12;
        });
        
        // Add addresses section if there are any
        const addresses = relatedTransactions.filter(node => node.type === 'address');
        if (addresses.length > 0) {
          // Check if we need a new page
          if (yPosition > 220) {
            pdf.addPage();
            yPosition = margin + 10;
          }
          
          // Add a divider line
          pdf.setDrawColor(200, 200, 200);
          pdf.line(margin, yPosition, pageWidth - margin, yPosition);
          yPosition += 10;
          
          pdf.setFontSize(12);
          pdf.setTextColor(0, 0, 0);
          pdf.text("Related Addresses:", margin, yPosition);
          yPosition += 8;
          
          addresses.forEach((addr, i) => {
            // Check if we need a new page
            if (yPosition > 260) {
              pdf.addPage();
              yPosition = margin + 10;
            }
            
            pdf.setFontSize(10);
            pdf.text(`Address ${i+1}:`, margin, yPosition);
            pdf.setFontSize(8);
            pdf.text(addr.hash || "Unknown", margin + 5, yPosition + 5);
            yPosition += 10;
          });
        }
      } else {
        // No data case
        pdf.setTextColor(150, 0, 0);
        pdf.text("No transaction data available.", margin, yPosition);
      }
      
      // Add notes section
      pdf.addPage();
      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0);
      pdf.text("Notes", margin, margin + 10);
      pdf.setFontSize(10);
      pdf.text("This report was generated by ChainPhantom.", margin, margin + 20);
      pdf.text("The visualization could not be included in this PDF due to technical limitations.", margin, margin + 28);
      pdf.text("For the full interactive visualization, please use the web application.", margin, margin + 36);
      
      // Create descriptive filename
      const mainNode = relatedTransactions?.find(node => node.main);
      const filename = mainNode 
        ? `chainphantom-report-${mainNode.hash.substring(0, 8)}.pdf`
        : `chainphantom-report-${new Date().getTime()}.pdf`;
      
      // Important: Don't save the PDF here because the parent component expects to handle the download
      // pdf.save(filename);  <-- Remove this line
      
      setIsExporting(false);
      return Promise.resolve({
        success: true,
        filename: filename,
        pdf: pdf // Return the PDF object so parent can use it
      });
    } catch (error) {
      console.error("PDF export error:", error);
      setIsExporting(false);
      alert("Failed to generate PDF: " + error.message);
      return Promise.reject(error);
    }
  };

  // Expose export function to parent component
  useEffect(() => {
    if (onExportPDF) {
      onExportPDF(handleExportPDF);
    }
  }, [onExportPDF, viewMode, traceDepth]);

  return (
    <div className="transaction-chain-container">
      <div className="chain-visualization-help">
        <div className="help-item">
          <FontAwesomeIcon icon={faInfoCircle} className="help-icon" />
          Use the depth slider to control how many levels of transactions to display.
        </div>
        <div className="help-item">
          <FontAwesomeIcon icon={faInfoCircle} className="help-icon" />
          Click and drag to pan the visualization. Use the zoom buttons or mouse wheel to zoom.
        </div>
        <div className="help-item">
          <FontAwesomeIcon icon={faInfoCircle} className="help-icon" />
          Hover over nodes to see more details. Click nodes to select them.
        </div>
      </div>

      <div className="trace-depth-header">
        <span>Trace Depth: <span className="depth-value">{traceDepth}</span> Level</span>
        <div className="depth-slider-wrapper">
          <input
            type="range"
            min="1"
            max="5"
            value={traceDepth}
            onChange={handleDepthChange}
            className="depth-slider"
          />
        </div>
      </div>
      
      {isLoading ? (
        <div className="tx-chain-loading" style={{ height: "300px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          Loading...
        </div>
      ) : relatedTransactions && relatedTransactions.length > 0 ? (
        <>
          <div className="visualization-controls">
            <div className="view-mode-buttons">
              <button
                className={`view-button ${viewMode === 'tree' ? 'active' : ''}`}
                onClick={() => setViewMode('tree')}
                title="Tree View"
              >
                <FontAwesomeIcon icon={faSitemap} />
                <span className="button-label">Tree View</span>
              </button>
              <button
                className={`view-button ${viewMode === 'network' ? 'active' : ''}`}
                onClick={() => setViewMode('network')}
                title="Network View"
              >
                <FontAwesomeIcon icon={faProjectDiagram} />
                <span className="button-label">Network View</span>
              </button>
            </div>
            <div className="zoom-controls">
              <button
                className="control-button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleZoomIn();
                }}
                title="Zoom In"
              >
                <FontAwesomeIcon icon={faSearchPlus} />
              </button>
              <div className="zoom-level">{zoom}%</div>
              <button
                className="control-button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleZoomOut();
                }}
                title="Zoom Out"
              >
                <FontAwesomeIcon icon={faSearchMinus} />
              </button>
              <button
                className="control-button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleResetZoom();
                }}
                title="Reset Zoom"
              >
                <FontAwesomeIcon icon={faSync} />
              </button>
            </div>
          </div>
          
          <div className="visualization-legend">
            <div className="legend-item">
              <div className="legend-dot transaction-dot"></div>
              <span>Transaction</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot address-dot"></div>
              <span>Address</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot main-dot"></div>
              <span>Main Transaction</span>
            </div>
            {viewMode === 'tree' && (
              <div className="legend-info">
                <FontAwesomeIcon icon={faInfoCircle} />
                <span>Tree view shows parent-child relationships</span>
              </div>
            )}
            {viewMode === 'network' && (
              <div className="legend-info">
                <FontAwesomeIcon icon={faInfoCircle} />
                <span>Network view shows interconnected transactions and addresses</span>
              </div>
            )}
          </div>
            
          <div 
            className="visualization-container" 
            id="viz-container" 
            ref={containerRef}
            style={{ height: "350px", minHeight: "350px", maxHeight: "none" }}
          >
            <svg 
              ref={svgRef} 
              className="tx-chain-svg" 
              style={{ 
                width: "100%", 
                height: "100%", 
                minHeight: "350px", 
                maxHeight: "none", 
                backgroundColor: "#0c1225",
                cursor: "grab"
              }}
            ></svg>
          </div>
          
          {tooltip.visible && (
            <div 
              className="tx-chain-tooltip" 
              style={{ 
                left: tooltip.x + 5, 
                top: tooltip.y + 5,
                fontSize: '10px',
                padding: '4px 6px'
              }}
            >
              {tooltip.content}
            </div>
          )}
          
          <div className="visualization-info">
            Showing {viewMode} visualization for transaction sample data with depth {traceDepth}
          </div>
        </>
      ) : (
        <div className="tx-chain-no-data">
          No graph data
        </div>
      )}
    </div>
  );
};

export default TransactionChainVisualization; 