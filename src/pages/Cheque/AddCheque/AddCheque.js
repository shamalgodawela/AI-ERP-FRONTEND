import React, { useState } from 'react';
import './AddCheque.css'; 
import Menu from '../../../compenents/Menu/Menu';

const AddCheque = () => {
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    ChequeNumber: '',
    ChequeValue: '',
    DepositeDate: '',
    Bankdetails:'',
    BankBranch:''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
              const response = await fetch('https://nihon-inventory.onrender.com/api/add-Cheque-Details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setFormData({ invoiceNumber: '', ChequeNumber: '', ChequeValue: '', DepositeDate: '',Bankdetails:'',BankBranch:'' });
      } else {
        setError(data.error || 'An error occurred');
      }
    } catch (err) {
      setError('Failed to connect to the server');
    }
  };

  return (
    <div>
        <Menu/><br/><br/><br/>
    <div className="add-cheque-container">
      <h1>Add Cheque Details</h1>
      <form className="add-cheque-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="invoiceNumber">Invoice Number</label>
          <input
            type="text"
            id="invoiceNumber"
            name="invoiceNumber"
            value={formData.invoiceNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="ChequeNumber">Cheque Number</label>
          <input
            type="text"
            id="ChequeNumber"
            name="ChequeNumber"
            value={formData.ChequeNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="ChequeValue">Cheque Value</label>
          <input
            type="number"
            id="ChequeValue"
            name="ChequeValue"
            value={formData.ChequeValue}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="DepositeDate">Due Date</label>
          <input
            type="date"
            id="DepositeDate"
            name="DepositeDate"
            value={formData.DepositeDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="DepositeDate">Branch Name</label>
          <input
            type="text"
            id="DepositeDate"
            name="BankBranch"
            value={formData.BankBranch}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
  
     <label htmlFor="BankName">Bank Name</label>
 <select
    id="BankName"
    name="Bankdetails"
    value={formData.Bankdetails}
    onChange={handleChange}
    required
  >
    <option value="">Select Bank</option>
    <option value="Bank of Ceylon">Bank of Ceylon</option>
    <option value="Commercial Bank">Commercial Bank</option>
    <option value="Hatton National Bank">Hatton National Bank</option>
    <option value="People's Bank">People's Bank</option>
    <option value="Sampath Bank">Sampath Bank</option>
    <option value="National Savings Bank">National Savings Bank</option>
    <option value="DFCC Bank">DFCC Bank</option>
  </select>
</div>


        <button type="submit" className="btn-submit">Submit</button>
      </form>

      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
    </div>
 </div>
  );
};

export default AddCheque;
