import React, { useState } from 'react';
import { AptosClient, AptosAccount } from 'aptos';

const ContractForm = () => {
  const [formData, setFormData] = useState({
    cropType: '',
    state: '',
    price: '',
    quantity: '',
    terms: '',
    payment: '',
  });

  const [account, setAccount] = useState(null); // Wallet connection state
  const aptosClient = new AptosClient('https://fullnode.testnet.aptoslabs.com/v1'); // Aptos testnet client

  const connectWallet = async () => {
    if (window.aptos) {
      try {
        const response = await window.aptos.connect();
        setAccount(response.address);
        alert('Wallet connected: ' + response.address);
      } catch (error) {
        alert('Failed to connect wallet: ' + error.message);
      }
    } else {
      alert('Aptos wallet not found. Please install a wallet extension.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!account) {
      alert('Please connect your wallet first.');
      return;
    }

    try {
      const payload = {
        type: 'entry_function_payload',
        function: '0xf273b1e243a16ce1c331924890ba21cbbc62ef5823b05c9c77ba0d121da71be3::report::submit_report',
        arguments: [
          formData.cropType,
          formData.state,
          parseFloat(formData.price),
          parseFloat(formData.quantity),
          formData.terms,
          formData.payment,
        ],
        type_arguments: [],
      };

      const transactionRequest = await window.aptos.signAndSubmitTransaction(payload);
      console.log('Transaction Submitted:', transactionRequest);
      alert('Contract submitted successfully! Transaction Hash: ' + transactionRequest.hash);

      // Reset form data
      setFormData({
        cropType: '',
        state: '',
        price: '',
        quantity: '',
        terms: '',
        payment: '',
      });
    } catch (error) {
      alert('Failed to submit contract: ' + error.message);
    }
  };

  return (
    <div style={{ backgroundColor: '#1c1c1e', color: 'white', minHeight: '100vh', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', padding: '20px', fontSize: '32px', color: '#ffc107' }}>
        Contract Form
      </h1>
      <button
        onClick={connectWallet}
        style={{
          backgroundColor: '#ffc107',
          color: 'black',
          padding: '10px 20px',
          fontSize: '16px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginBottom: '20px',
        }}
      >
        {account ? 'Wallet Connected' : 'Connect Wallet'}
      </button>
      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          backgroundColor: '#292929',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        }}
      >
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
          Type of Crops:
          <select
            name="cropType"
            value={formData.cropType}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px',
              margin: '10px 0',
              borderRadius: '5px',
              border: 'none',
            }}
          >
            <option value="">Select type of crops</option>
            <option value="Wheat">Wheat</option>
            <option value="Rice">Rice</option>
            <option value="Maize">Maize</option>
          </select>
        </label>

        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
          State:
          <select
            name="state"
            value={formData.state}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px',
              margin: '10px 0',
              borderRadius: '5px',
              border: 'none',
            }}
          >
            <option value="">Select state</option>
            <option value="Haryana">Haryana</option>
            <option value="Punjab">Punjab</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
          </select>
        </label>

        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
          Price per Kg:
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px',
              margin: '10px 0',
              borderRadius: '5px',
              border: 'none',
            }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
          Expected Quantity:
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px',
              margin: '10px 0',
              borderRadius: '5px',
              border: 'none',
            }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
          Contract Terms:
          <textarea
            name="terms"
            value={formData.terms}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px',
              margin: '10px 0',
              borderRadius: '5px',
              border: 'none',
            }}
          ></textarea>
        </label>

        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
          Down Payment:
          <select
            name="payment"
            value={formData.payment}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px',
              margin: '10px 0',
              borderRadius: '5px',
              border: 'none',
            }}
          >
            <option value="">Select payment option</option>
            <option value="20">20</option>
            <option value="10">10</option>
          </select>
        </label>

        <button
          type="submit"
          style={{
            backgroundColor: '#ffc107',
            color: 'black',
            padding: '10px 20px',
            fontSize: '16px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '10px',
          }}
        >
          Submit Contract
        </button>
      </form>
    </div>
  );
};

export default ContractForm;
