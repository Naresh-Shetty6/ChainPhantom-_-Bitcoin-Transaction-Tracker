import React from 'react';
import { saveAs } from 'file-saver';
import './TransactionExport.css';

const TransactionExport = ({ transaction }) => {
  // Format transaction data for export
  const prepareDataForExport = () => {
    if (!transaction) return null;
    
    // Structure the data in a consistent format regardless of the source
    const txData = {
      transaction_hash: transaction.hash || transaction.txid || '',
      block_height: transaction.block_height || transaction.block_index || null,
      timestamp: transaction.time || transaction.created || null,
      status: (transaction.confirmed || transaction.block_height || transaction.block_index) ? 'Confirmed' : 'Unconfirmed',
      size: transaction.size || transaction.weight / 4 || 0,
      fee: transaction.fee || 0,
      fee_rate: transaction.fee_rate || (transaction.fee / (transaction.size || transaction.weight / 4)) || 0,
      inputs: [],
      outputs: []
    };
    
    // Process inputs
    if (transaction.vin && Array.isArray(transaction.vin)) {
      transaction.vin.forEach(input => {
        if (input.prevout) {
          txData.inputs.push({
            address: input.prevout.scriptpubkey_address || 'Unknown',
            value: input.prevout.value || 0,
            is_coinbase: false
          });
        }
      });
    }
    
    if (transaction.inputs && Array.isArray(transaction.inputs)) {
      transaction.inputs.forEach(input => {
        if (input.prev_out) {
          txData.inputs.push({
            address: input.prev_out.addr || 'Unknown',
            value: input.prev_out.value || 0,
            is_coinbase: input.coinbase || false
          });
        }
      });
    }
    
    // Process outputs
    if (transaction.vout && Array.isArray(transaction.vout)) {
      transaction.vout.forEach(output => {
        txData.outputs.push({
          address: output.scriptpubkey_address || 'Unknown',
          value: output.value || 0
        });
      });
    }
    
    if (transaction.out && Array.isArray(transaction.out)) {
      transaction.out.forEach(output => {
        txData.outputs.push({
          address: output.addr || 'Unknown',
          value: output.value || 0
        });
      });
    }
    
    return txData;
  };
  
  // Export transaction data as JSON
  const exportAsJSON = () => {
    const data = prepareDataForExport();
    if (!data) {
      alert('No transaction data available for export');
      return;
    }
    
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    saveAs(blob, `tx-${data.transaction_hash.substring(0, 8)}.json`);
  };
  
  // Export transaction data as CSV
  const exportAsCSV = () => {
    const data = prepareDataForExport();
    if (!data) {
      alert('No transaction data available for export');
      return;
    }
    
    // Create CSV content
    let csvContent = 'data:text/csv;charset=utf-8,';
    
    // Add transaction header row
    csvContent += 'Transaction Hash,Block Height,Timestamp,Status,Size (bytes),Fee (satoshis),Fee Rate (sat/vB)\n';
    
    // Add transaction data
    csvContent += `"${data.transaction_hash}",${data.block_height || 'Pending'},${data.timestamp || ''},${data.status},${data.size},${data.fee},${data.fee_rate}\n\n`;
    
    // Add inputs header
    csvContent += 'INPUTS\n';
    csvContent += 'Address,Value (satoshis),Is Coinbase\n';
    
    // Add input data
    data.inputs.forEach(input => {
      csvContent += `"${input.address}",${input.value},${input.is_coinbase}\n`;
    });
    
    csvContent += '\n';
    
    // Add outputs header
    csvContent += 'OUTPUTS\n';
    csvContent += 'Address,Value (satoshis)\n';
    
    // Add output data
    data.outputs.forEach(output => {
      csvContent += `"${output.address}",${output.value}\n`;
    });
    
    // Create and download the CSV file
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `tx-${data.transaction_hash.substring(0, 8)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Generate PDF report
  const generatePDFReport = () => {
    alert('PDF report generation will be implemented here');
    // PDF generation would typically be implemented with a library like jsPDF
    // This is just a placeholder for now
  };
  
  // If no transaction data, disable the export buttons
  const isDataAvailable = !!transaction;
  
  return (
    <div className="transaction-export">
      <h5 className="export-title">Export Transaction Data</h5>
      <div className="export-buttons">
        <button
          onClick={exportAsJSON}
          disabled={!isDataAvailable}
          className="export-button json-button"
        >
          <i className="fas fa-file-code"></i> JSON
        </button>
        <button
          onClick={exportAsCSV}
          disabled={!isDataAvailable}
          className="export-button csv-button"
        >
          <i className="fas fa-file-csv"></i> CSV
        </button>
      </div>
      
      <div className="pdf-export-section mt-3">
        <button 
          onClick={generatePDFReport} 
          disabled={!isDataAvailable}
          className="btn btn-primary generate-pdf-btn"
        >
          <i className="fas fa-file-pdf me-2"></i> Generate PDF Report
        </button>
      </div>
    </div>
  );
};

export default TransactionExport; 