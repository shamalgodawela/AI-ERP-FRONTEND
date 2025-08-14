import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditCheque = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    invoiceNumber: '',
    ChequeNumber: '',
    ChequeValue: '',
    DepositeDate: '',
    Bankdetails: '',
    BankBranch: '',
    status: ''
  });

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchCheque = async () => {
      try {
        const res = await axios.get(`https://nihon-inventory.onrender.com/get-single-Cheque/:id`);
        const cheque = res.data.cheques.find(c => c._id === id);
        if (cheque) {
          setFormData({
            invoiceNumber: cheque.invoiceNumber || '',
            ChequeNumber: cheque.ChequeNumber || '',
            ChequeValue: cheque.ChequeValue || '',
            DepositeDate: cheque.DepositeDate ? cheque.DepositeDate.substring(0, 10) : '',
            Bankdetails: cheque.Bankdetails || '',
            BankBranch: cheque.BankBranch || '',
            status: cheque.status || ''
          });
        }
      } catch (err) {
        console.error('Error fetching cheque:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCheque();
  }, [id]);


  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://nihon-inventory.onrender.com/api/edit-Cheque-Details/${id}`, formData);
      alert('Cheque updated successfully');
      navigate('/all-cheques'); 
    } catch (err) {
      console.error('Error updating cheque:', err);
      alert('Failed to update cheque');
    }
  };

  if (loading) return <div>Loading cheque details...</div>;

  return (
    <div className="edit-cheque-container">
      <h2>Edit Cheque</h2>
      <form onSubmit={handleSubmit} className="edit-cheque-form">
        <input
          type="text"
          name="invoiceNumber"
          placeholder="Invoice Number"
          value={formData.invoiceNumber}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="ChequeNumber"
          placeholder="Cheque Number"
          value={formData.ChequeNumber}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="ChequeValue"
          placeholder="Cheque Value"
          value={formData.ChequeValue}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="DepositeDate"
          value={formData.DepositeDate}
          onChange={handleChange}
        />
        <input
          type="text"
          name="Bankdetails"
          placeholder="Bank Name"
          value={formData.Bankdetails}
          onChange={handleChange}
        />
        <input
          type="text"
          name="BankBranch"
          placeholder="Bank Branch"
          value={formData.BankBranch}
          onChange={handleChange}
        />
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="">Select Status</option>
          <option value="Pending">Pending</option>
          <option value="Cleared">Cleared</option>
          <option value="Bounced">Bounced</option>
        </select>
        <button type="submit">Update Cheque</button>
      </form>
    </div>
  );
};

export default EditCheque;
