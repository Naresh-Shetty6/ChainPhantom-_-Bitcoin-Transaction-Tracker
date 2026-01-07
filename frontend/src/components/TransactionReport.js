import React, { useRef } from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import './TransactionReport.css';

// PDF styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#0c1525',
    fontFamily: 'Helvetica',
    color: '#e0e0e0',
  },
  header: {
    fontSize: 26,
    marginBottom: 25,
    textAlign: 'center',
    color: '#1a237e',
    paddingBottom: 10,
    borderBottom: '1px solid #1a237e',
  },
  section: {
    margin: 15,
    marginBottom: 25,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: 'bold',
    color: '#1a237e',
    borderBottom: '1px solid #dee2e6',
    paddingBottom: 8,
  },
  row: {
    display: 'flex',
    flexDirection: 'column',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    borderBottomStyle: 'solid',
    paddingVertical: 10,
    marginBottom: 8,
  },
  rowHeader: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  addressRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  cell: {
    marginRight: 8,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 8,
    width: '30%',
    fontSize: 12,
    color: '#424242',
  },
  value: {
    fontWeight: 'normal',
    width: '70%',
    wordBreak: 'break-all',
    fontSize: 12,
    color: '#212121',
  },
  hashValue: {
    fontWeight: 'normal',
    width: '70%',
    wordBreak: 'break-all',
    fontSize: 12,
    color: '#212121',
  },
  addressValue: {
    width: '70%',
    wordBreak: 'break-all',
    fontSize: 12,
    color: '#212121',
  },
  btcValue: {
    fontWeight: 'normal',
    marginTop: 2,
    fontSize: 12,
    color: '#0d47a1',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 10,
    textAlign: 'center',
    color: '#616161',
    borderTop: '1px solid #e0e0e0',
    paddingTop: 10,
  },
  logoText: {
    fontSize: 12,
    color: '#1a237e',
    fontWeight: 'bold',
  }
});

// PDF Document Component
const TransactionReportPDF = ({ transaction, senders, receivers, chainData, formatTime, satoshisToBTC, formatHash, getStatus }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Transaction Report</Text>
      
      <View style={styles.section}>
        <Text style={styles.title}>Transaction Overview</Text>
        <View style={styles.row}>
          <View style={styles.rowHeader}>
            <Text style={styles.label}>Transaction Hash:</Text>
            <Text style={styles.hashValue}>{transaction.hash || transaction.txid || 'Unknown'}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.rowHeader}>
            <Text style={styles.label}>Status:</Text>
            <Text style={styles.value}>{getStatus()}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.rowHeader}>
            <Text style={styles.label}>Timestamp:</Text>
            <Text style={styles.value}>{formatTime(transaction.time || transaction.created)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.rowHeader}>
            <Text style={styles.label}>Block:</Text>
            <Text style={styles.value}>{transaction.block_height || transaction.block_index || 'Pending'}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.rowHeader}>
            <Text style={styles.label}>Fee:</Text>
            <Text style={styles.value}>{satoshisToBTC(transaction.fee || 0)} BTC</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.rowHeader}>
            <Text style={styles.label}>Size:</Text>
            <Text style={styles.value}>{transaction.size || transaction.weight / 4 || 0} bytes</Text>
          </View>
        </View>
      </View>
      
      {senders.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.title}>Sender Addresses</Text>
          {senders.map((sender, i) => (
            <View key={`sender-${i}`} style={styles.row}>
              <View style={styles.addressRow}>
                <Text style={styles.label}>Address:</Text>
                <Text style={styles.addressValue}>{sender.address}</Text>
              </View>
              <View style={styles.addressRow}>
                <Text style={styles.label}>Value:</Text>
                <Text style={styles.btcValue}>{satoshisToBTC(sender.value)} BTC</Text>
              </View>
            </View>
          ))}
        </View>
      )}
      
      {receivers.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.title}>Receiver Addresses</Text>
          {receivers.map((receiver, i) => (
            <View key={`receiver-${i}`} style={styles.row}>
              <View style={styles.addressRow}>
                <Text style={styles.label}>Address:</Text>
                <Text style={styles.addressValue}>{receiver.address}</Text>
              </View>
              <View style={styles.addressRow}>
                <Text style={styles.label}>Value:</Text>
                <Text style={styles.btcValue}>{satoshisToBTC(receiver.value)} BTC</Text>
              </View>
            </View>
          ))}
        </View>
      )}
      
      {chainData && chainData.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.title}>Transaction Chain</Text>
          {chainData.map((item, i) => (
            <View key={`chain-${i}`} style={styles.row}>
              <View style={styles.addressRow}>
                <Text style={styles.label}>Transaction:</Text>
                <Text style={styles.addressValue}>{item.hash || item.txid}</Text>
              </View>
              <View style={styles.addressRow}>
                <Text style={styles.label}>Direction:</Text>
                <Text style={styles.value}>{item.direction}</Text>
              </View>
              <View style={styles.addressRow}>
                <Text style={styles.label}>Value:</Text>
                <Text style={styles.value}>{satoshisToBTC(item.value)} BTC</Text>
              </View>
              <View style={styles.addressRow}>
                <Text style={styles.label}>Time:</Text>
                <Text style={styles.value}>{formatTime(item.time)}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
      
      <View style={styles.footer}>
        <Text style={styles.logoText}>ChainPhantom</Text>
        <Text>Generated on: {new Date().toLocaleString()}</Text>
        <Text>This report is provided for informational purposes only.</Text>
      </View>
    </Page>
  </Document>
);

const TransactionReport = ({ transaction, chainData }) => {
  const reportRef = useRef();
  
  // Format timestamp to readable date/time
  const formatTime = (timestamp) => {
    if (!timestamp) return 'Unknown';
    return new Date(timestamp * 1000).toLocaleString();
  };
  
  // Convert satoshis to BTC
  const satoshisToBTC = (satoshis) => {
    if (!satoshis && satoshis !== 0) return '0.00000000';
    return (satoshis / 100000000).toFixed(8);
  };
  
  // Format hash for display
  const formatHash = (hash) => {
    if (!hash) return 'N/A';
    if (hash.length > 16) {
      return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
    }
    return hash;
  };

  // Extract sender addresses
  const extractSenders = () => {
    const senders = [];
    
    // From vin.prevout.scriptpubkey_address (blockstream format)
    if (transaction.vin && Array.isArray(transaction.vin)) {
      transaction.vin.forEach(input => {
        if (input.prevout && input.prevout.scriptpubkey_address) {
          senders.push({
            address: input.prevout.scriptpubkey_address,
            value: input.prevout.value || 0
          });
        }
      });
    }
    
    // From inputs (blockchain.info format)
    if (transaction.inputs && Array.isArray(transaction.inputs)) {
      transaction.inputs.forEach(input => {
        if (input.prev_out && input.prev_out.addr) {
          senders.push({
            address: input.prev_out.addr,
            value: input.prev_out.value || 0
          });
        }
      });
    }
    
    return senders;
  };
  
  // Extract receiver addresses
  const extractReceivers = () => {
    const receivers = [];
    
    // From vout.scriptpubkey_address (blockstream format)
    if (transaction.vout && Array.isArray(transaction.vout)) {
      transaction.vout.forEach(output => {
        if (output.scriptpubkey_address) {
          receivers.push({
            address: output.scriptpubkey_address,
            value: output.value || 0
          });
        }
      });
    }
    
    // From out (blockchain.info format)
    if (transaction.out && Array.isArray(transaction.out)) {
      transaction.out.forEach(output => {
        if (output.addr) {
          receivers.push({
            address: output.addr,
            value: output.value || 0
          });
        }
      });
    }
    
    return receivers;
  };
  
  // Calculate transaction status
  const getStatus = () => {
    if (transaction.confirmed) return 'Confirmed';
    if (transaction.block_height || transaction.block_index) return 'Confirmed';
    return 'Unconfirmed';
  };
  
  // If no transaction data, show message
  if (!transaction) {
    return (
      <div className="report-error">
        <p>No transaction data available for report generation.</p>
      </div>
    );
  }
  
  const senders = extractSenders();
  const receivers = extractReceivers();
  
  return (
    <div className="transaction-report">
      <div className="report-actions">
        <PDFDownloadLink
          document={<TransactionReportPDF transaction={transaction} senders={senders} receivers={receivers} chainData={chainData} formatTime={formatTime} satoshisToBTC={satoshisToBTC} formatHash={formatHash} getStatus={getStatus} />}
          fileName={`tx-report-${formatHash(transaction.hash || transaction.txid || '')}.pdf`}
          className="generate-pdf-button"
        >
          {({ blob, url, loading, error }) => 
            loading ? 'Preparing PDF...' : <><i className="fas fa-file-pdf"></i> Generate PDF Report</>
          }
        </PDFDownloadLink>
      </div>
    </div>
  );
};

export default TransactionReport; 