import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Footer from '../../../compenents/footer/Footer';

const SingleCheque = () => {
  const { invoiceNumber } = useParams();
  const navigate = useNavigate();

  const [gatePass, setGatePass] = useState('');
  const [chequeData, setChequeData] = useState({
    chequeNo: '',
    bankName: '',
    depositDate: '',
    amount: '',
    status: 'Pending',
  });

  // Fetch current invoice GatePass
  useEffect(() => {
    axios
      .get(`https://nihon-inventory.onrender.com/api/invoices/${invoiceNumber}`)
      .then(res => {
        if (res.data.GatePassNo) setGatePass(res.data.GatePassNo);
      })
      .catch(err => {
        console.error(err);
        toast.error('Failed to fetch invoice');
      });
  }, [invoiceNumber]);

  const handleUpdateInvoice = async () => {
    try {
      const payload = { GatePassNo: gatePass };

      // Only send chequeData if chequeNo & amount exist
      if (chequeData.chequeNo && chequeData.amount) {
        payload.chequeData = chequeData;
      }

      const res = await axios.put(
        `https://nihon-inventory.onrender.com/api/invoices/${invoiceNumber}`,
        payload
      );

      toast.success('Invoice updated successfully!');
      // Reset cheque form
      setChequeData({
        chequeNo: '',
        bankName: '',
        depositDate: '',
        amount: '',
        status: 'Pending',
      });

    } catch (err) {
      console.error(err);
      toast.error('Error updating invoice');
    }
  };

  return (
    <div className="edit-invoice-container">
      <button onClick={() => navigate(-1)} className="back-btn">← Back</button>

      <h2>Invoice Status Update</h2>

      {/* GatePass */}
      <div className="form-group">
        <label>Invoice Status</label>
        <select value={gatePass} onChange={e => setGatePass(e.target.value)}>
          <option value="">Select</option>
          <option value="Printed">Printed</option>
          <option value="Delivered">Delivered</option>
          <option value="Canceled">Canceled</option>
          <option value="Free Issued">Free Issued</option>
          <option value="Executive Stock">Executive Stock</option>
        </select>
      </div>

      {/* Add Cheque */}
      <h3>Add Cheque</h3>
      <div className="form-group">
        <label>Cheque No</label>
        <input
          type="text"
          value={chequeData.chequeNo}
          onChange={e => setChequeData({ ...chequeData, chequeNo: e.target.value })}
        />
      </div>
      <div className="form-group">
  <label>Bank Name</label>
  <select
    value={chequeData.bankName}
    onChange={e =>
      setChequeData({ ...chequeData, bankName: e.target.value })
    }
  >
    <option value="">Select Bank</option>
    <option value="BOC">BOC</option>
    <option value="Peoples Bank">People's</option>
    <option value="Commercial Bank">Commercial</option>
    <option value="HNB">HNB</option>
    <option value="Sampath Bank">Sampath</option>
    <option value="NSB">NSB</option>
    <option value="DFCC">DFCC</option>HNB
    <option value="AMANA">AMANA</option>
    
  </select>
</div>


      <div className="form-group">
        <label>Deposit Date</label>
        <input
          type="date"
          value={chequeData.depositDate}
          onChange={e => setChequeData({ ...chequeData, depositDate: e.target.value })}
        />
      </div>
      <div className="form-group">
        <label>Amount</label>
        <input
          type="number"
          value={chequeData.amount}
          onChange={e => setChequeData({ ...chequeData, amount: e.target.value })}
        />
      </div>
      <div className="form-group">
        <label>Status</label>
        <select
          value={chequeData.status}
          onChange={e => setChequeData({ ...chequeData, status: e.target.value })}
        >
          <option value="Pending">Pending</option>
          <option value="Cleared">Cleared</option>
          <option value="Bounced">Bounced</option>
        </select>
      </div>

      <button onClick={handleUpdateInvoice} className="update-btn">Update Invoice</button>
      <button onClick={() => navigate('/account-dash')} className="home-btn">Home</button>

      <Footer />
    </div>
  );
};

export default SingleCheque;
