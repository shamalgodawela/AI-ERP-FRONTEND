import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import NavBar from '../../compenents/sidebar/NavBar';
import './stationeryuse.css'

const Stationeryuse = () => {
  const [formData, setFormData] = useState({
    codeuse: '',
    name: '',
    usedBy: '',
    quantity: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
              const response = await axios.post('http://localhost:5000/api/addstationeryuse', formData);
      console.log('Stationery added successfully:', response.data);
      toast.success('data added successfully')
      // Reset the form after successful submission
      setFormData({
        codeuse: '',
        name: '',
        usedBy: '',
        quantity: ''
      });
    } catch (error) {
      console.error('Error adding stationery:', error.response.data.message);
    }
  };

  return (
    
    <div>
        <NavBar/>
    <div className="add-stationery-container"> {/* Unique container class */}
      <h2>Add Stationery</h2>
      <form className="stationery-form" onSubmit={handleSubmit}> {/* Unique form class */}
        <div className="form-group">
          <label htmlFor="codeuse">Code:</label>
          <input type="text" id="codeuse" name="codeuse" value={formData.codeuse} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="usedBy">Used By:</label>
          <input type="text" id="usedBy" name="usedBy" value={formData.usedBy} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="quantity">Quantity:</label>
          <input type="number" id="quantity" name="quantity" value={formData.quantity} onChange={handleChange} required />
        </div>
        <button type="submit" className="submit-button">Add Stationery</button> {/* Unique submit button class */}
      </form>
    </div>
    </div>
  );
};

export default Stationeryuse;
