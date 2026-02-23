import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './edit.css';
import Footer from '../../../compenents/footer/Footer';
import { toast } from 'react-toastify';

const EditInvoice = () => {
  const { invoiceNumber } = useParams();
  const navigate = useNavigate();

  const [gatePass, setGatePass] = useState('');
  const [incentiveDueDate, setIncentiveDueDate] = useState('');
  const [incentiveStatus, setIncentiveStatus] = useState('');
  const [incentiveSettlement, setIncentiveSettlement] = useState('');
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
        if (res.data.IncentiveDueDate) setIncentiveDueDate(res.data.IncentiveDueDate);
        if (res.data.IncentiveStatus) setIncentiveStatus(res.data.IncentiveStatus);
        if (res.data.Incentivesettlement) setIncentiveSettlement(res.data.Incentivesettlement);
      })
      .catch(err => {
        console.error(err);
        toast.error('Failed to fetch invoice');
      });
  }, [invoiceNumber]);

  const handleUpdateInvoice = async () => {
    try {
      const payload = { GatePassNo: gatePass };

      // Add incentive fields
      if (incentiveDueDate) payload.IncentiveDueDate = incentiveDueDate;
      if (incentiveStatus) payload.IncentiveStatus = incentiveStatus;
      if (incentiveSettlement) payload.Incentivesettlement = incentiveSettlement;

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

      {/* Incentive Fields */}
      <h3>Incentive Details</h3>
      <div className="form-group">
        <label>Incentive Due Date</label>
        <input
          type="date"
          value={incentiveDueDate}
          onChange={e => setIncentiveDueDate(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Incentive Status</label>
        <select
          value={incentiveStatus}
          onChange={e => setIncentiveStatus(e.target.value)}
        >
          <option value="">Select</option>
          <option value="Not_Eligible">Not_Eligible</option>
          <option value="Settled">Settled</option>
        </select>
      </div>
      <div className="form-group">
        <label>Incentive Settlement</label>
        <select
          value={incentiveSettlement}
          onChange={e => setIncentiveSettlement(e.target.value)}
        >
          <option value="">Select</option>
          <option value="Not_Received">Not_Received</option>
          <option value="Received">Received</option>
          <option value="Pending">Pending</option>
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
        <input
          type="text"
          value={chequeData.bankName}
          onChange={e => setChequeData({ ...chequeData, bankName: e.target.value })}
        />
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
      <button onClick={() => navigate('/admin-profile')} className="home-btn">Home</button>

      <Footer />
    </div>
  );
};

export default EditInvoice;
