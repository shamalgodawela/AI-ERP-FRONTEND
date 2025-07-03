import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AddOfficeInventory.css';

const AddOfficeInventory = () => {
  const [formData, setFormData] = useState({
    codeNumber: '',
    model: '',
    type: '',
    dateOfPurchase: '',
    value: '',
    warrantyPeriod: '',
    usedBy: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
              const response = await axios.post('http://localhost:5000/api/addoffice', formData);
      if (response.status === 201) {
        toast.success('Office Inventory details added successfully');
        setFormData({
          codeNumber: '',
          model: '',
          type: '',
          dateOfPurchase: '',
          value: '',
          warrantyPeriod: '',
          usedBy: ''
        });
      } else {
        toast.error('Failed to add Office Inventory details');
      }
    } catch (error) {
      console.error('Error adding Office Inventory details:', error);
      toast.error('Failed to add Office Inventory details');
    }
  };

  return (
    <div className="office-form-container"> {/* Apply the CSS class */}
      <h2>Add Office Inventory</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="codeNumber">Code Number:</label>
        <input type="text" id="codeNumber" name="codeNumber" value={formData.codeNumber} onChange={handleChange} required />

        <label htmlFor="model">Model:</label>
        <input type="text" id="model" name="model" value={formData.model} onChange={handleChange} required />

        <label htmlFor="type">Type:</label>
        <input type="text" id="type" name="type" value={formData.type} onChange={handleChange} required />

        <label htmlFor="dateOfPurchase">Date of Purchase:</label>
        <input type="date" id="dateOfPurchase" name="dateOfPurchase" value={formData.dateOfPurchase} onChange={handleChange} required />

        <label htmlFor="value">Value:</label>
        <input type="number" id="value" name="value" value={formData.value} onChange={handleChange} required />

        <label htmlFor="warrantyPeriod">Warranty Period:</label>
        <input type="text" id="warrantyPeriod" name="warrantyPeriod" value={formData.warrantyPeriod} onChange={handleChange} required />

        <label htmlFor="usedBy">Used By:</label>
        <input type="text" id="usedBy" name="usedBy" value={formData.usedBy} onChange={handleChange} required />

        <button type="submit">Add Inventory</button>
      </form>
      <ToastContainer position="top-center" />
    </div>
  );
};

export default AddOfficeInventory;
