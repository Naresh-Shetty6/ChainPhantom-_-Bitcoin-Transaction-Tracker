import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import './TransactionAddressSummary.css';

const satoshisToBTC = (sats) => {
  if (sats === undefined || sats === null || isNaN(sats)) return "0.00000000";
  return (sats / 1e8).toFixed(8);
};

const TransactionAddressSummary = ({ transaction }) => {
  if (!transaction) return null;
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => alert(`Copied: ${text}`))
      .catch(err => console.error('Failed to copy: ', err));
  };
  
  // Check if transaction has inputs/outputs data
  const hasTransactionData = transaction.inputs?.length > 0 || transaction.outputs?.length > 0;
  
  if (!hasTransactionData) {
    return (
      <div className="transaction-addresses-summary">
        <div className="address-summary-header">
          <h5>Transaction Addresses Summary</h5>
        </div>
        <div className="no-data-message">
          <p>Transaction data is not available or still processing.</p>
        </div>
      </div>
    );
  }
  
  // Summarize inputs (senders)
  const senders = transaction.inputs?.reduce((acc, input) => {
    if (input.coinbase) {
      acc.push({
        address: 'Coinbase (New Coins)',
        value: transaction.total_output_value || transaction.total || 0,
        isCoinbase: true
      });
      return acc;
    }
    
    const address = input.address || (input.prev_out?.addr) || (input.addresses ? input.addresses[0] : 'Unknown');
    
    const existingIndex = acc.findIndex(i => i.address === address);
    if (existingIndex >= 0) {
      acc[existingIndex].value += (input.value || input.prev_out?.value || 0);
    } else {
      acc.push({
        address: address,
        value: input.value || input.prev_out?.value || 0,
        isCoinbase: false
      });
    }
    return acc;
  }, []) || [];
  
  // Summarize outputs (receivers)
  const receivers = transaction.outputs?.reduce((acc, output) => {
    const address = output.address || (output.addresses ? output.addresses[0] : 'Unknown');
    
    const existingIndex = acc.findIndex(o => o.address === address);
    if (existingIndex >= 0) {
      acc[existingIndex].value += (output.value || 0);
    } else {
      acc.push({
        address: address,
        value: output.value || 0
      });
    }
    return acc;
  }, []) || [];
  
  return (
    <div className="transaction-addresses-summary">
      <div className="address-summary-header">
        <h5>Transaction Addresses Summary</h5>
      </div>
      
      <div className="row">
        <div className="col-md-6">
          <div className="sender-addresses">
            <h6>Sender Addresses ({senders.length})</h6>
            {senders.length > 0 ? (
              senders.map((sender, idx) => (
                <div key={idx} className="address-block">
                  <div className="address-content">
                    {sender.isCoinbase ? (
                      <span className="coinbase-label">{sender.address}</span>
                    ) : (
                      <>
                        <span className="address-text">{sender.address}</span>
                        <div className="address-actions">
                          <button 
                            className="address-action" 
                            onClick={() => copyToClipboard(sender.address)}
                            title="Copy address"
                          >
                            <FontAwesomeIcon icon={faCopy} />
                          </button>
                          <a 
                            href={`/address/${sender.address}`} 
                            className="address-action"
                            title="View address details"
                          >
                            <FontAwesomeIcon icon={faExternalLinkAlt} />
                          </a>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="address-amount">
                    {satoshisToBTC(sender.value)} BTC
                  </div>
                </div>
              ))
            ) : (
              <div className="no-addresses">No sender data available</div>
            )}
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="receiver-addresses">
            <h6>Receiver Addresses ({receivers.length})</h6>
            {receivers.length > 0 ? (
              receivers.map((receiver, idx) => (
                <div key={idx} className="address-block">
                  <div className="address-content">
                    <span className="address-text">{receiver.address}</span>
                    <div className="address-actions">
                      <button 
                        className="address-action" 
                        onClick={() => copyToClipboard(receiver.address)}
                        title="Copy address"
                      >
                        <FontAwesomeIcon icon={faCopy} />
                      </button>
                      <a 
                        href={`/address/${receiver.address}`} 
                        className="address-action"
                        title="View address details"
                      >
                        <FontAwesomeIcon icon={faExternalLinkAlt} />
                      </a>
                    </div>
                  </div>
                  <div className="address-amount">
                    {satoshisToBTC(receiver.value)} BTC
                  </div>
                </div>
              ))
            ) : (
              <div className="no-addresses">No receiver data available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionAddressSummary; 