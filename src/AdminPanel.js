import React, { useEffect, useState } from 'react';
import { AptosClient } from 'aptos';

const AdminPanel = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState(null);

  const aptosClient = new AptosClient('https://fullnode.testnet.aptoslabs.com/v1'); // Aptos Testnet Client
  const resourceType = '0xf273b1e243a16ce1c331924890ba21cbbc62ef5823b05c9c77ba0d121da71be3::report::ReportList'; // Replace with your resource type

  // Function to connect wallet
  const connectWallet = async () => {
    if (window.aptos) {
      try {
        const response = await window.aptos.connect();
        setWalletAddress(response.address);
      } catch (error) {
        console.error('Failed to connect wallet:', error.message);
      }
    } else {
      alert('No Aptos wallet found. Please install a compatible wallet.');
    }
  };

  // Fetch contract data once the wallet is connected
  useEffect(() => {
    if (!walletAddress) return;

    const fetchContractData = async () => {
      try {
        const resource = await aptosClient.getAccountResource(walletAddress, resourceType);

        // Assuming the resource data structure:
        // {
        //   "data": {
        //     "reports": [
        //       {
        //         "id": 1,
        //         "timestamp": "2024-11-18",
        //         "cropType": "Wheat",
        //         "state": "Haryana",
        //         "price": "2000",
        //         "quantity": "50",
        //         "terms": "Advance",
        //         "payment": "Pending"
        //       },
        //       ...
        //     ]
        //   }
        // }
        setReports(resource.data.reports || []);
      } catch (error) {
        console.error('Failed to fetch contract data:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContractData();
  }, [walletAddress]);

  return (
    <div style={{ backgroundColor: '#1c1c1e', color: 'white', minHeight: '100vh', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', padding: '20px', color: '#ffc107', fontSize: '32px' }}>
        Admin Panel - Reports
      </h1>

      {/* Wallet Connection Section */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        {walletAddress ? (
          <p style={{ color: '#ffc107' }}>
            Connected Wallet: <strong>{walletAddress}</strong>
          </p>
        ) : (
          <button
            onClick={connectWallet}
            style={{
              backgroundColor: '#ffc107',
              color: '#1c1c1e',
              border: 'none',
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer',
              borderRadius: '5px',
            }}
          >
            Connect Wallet
          </button>
        )}
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#ffc107' }}>Loading...</p>
      ) : reports.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', color: 'white' }}>
          <thead>
            <tr style={{ backgroundColor: '#292929', color: '#ffc107', textAlign: 'left' }}>
              <th style={{ padding: '10px', border: '1px solid #444' }}>Timestamp</th>
              <th style={{ padding: '10px', border: '1px solid #444' }}>Crops</th>
              <th style={{ padding: '10px', border: '1px solid #444' }}>State</th>
              <th style={{ padding: '10px', border: '1px solid #444' }}>Price</th>
              <th style={{ padding: '10px', border: '1px solid #444' }}>Quantity</th>
              <th style={{ padding: '10px', border: '1px solid #444' }}>Terms</th>
              <th style={{ padding: '10px', border: '1px solid #444' }}>Payment</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report, index) => (
              <tr key={index}>
                
                <td style={{ padding: '10px', border: '1px solid #444' }}>{report.timestamp}</td>
                <td style={{ padding: '10px', border: '1px solid #444' }}>{report.crops}</td>
                <td style={{ padding: '10px', border: '1px solid #444' }}>{report.state}</td>
                <td style={{ padding: '10px', border: '1px solid #444' }}>₹{report.price}</td>
                <td style={{ padding: '10px', border: '1px solid #444' }}>{report.quantity}kg</td>
                <td style={{ padding: '10px', border: '1px solid #444' }}>{report.terms}</td>
                <td style={{ padding: '10px', border: '1px solid #444' }}>{report.payment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ textAlign: 'center', color: '#ffc107' }}>No reports available.</p>
      )}
    </div>
  );
};

export default AdminPanel;
