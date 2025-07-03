// StationeryForm.js
import React, { useState } from 'react';
import axios from 'axios';
import './stationery.css'
import { toast } from 'react-toastify';

const StationeryForm = () => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim() || !name.trim() || !quantity.trim() || !price.trim()) return;
    try {
              await axios.post(`http://localhost:5000/api/add/stationery`, { code, name, quantity, price });
      toast.success('Stationery item added successfully');
      // Clear the form after successful submission
      setCode('');
      setName('');
      setQuantity('');
      setPrice('');
    } catch (error) {
      console.error('Error adding stationery item:', error);
      toast.error('Failed to add stationery item');
    }
  };

  return (
    <form className="stationery-form" onSubmit={handleSubmit}>
    <h2>Add Stationery Item</h2>
    <div className="form-group">
      <label htmlFor="code">Code:</label>
      <input type="text" id="code" className="form-control" value={code} onChange={(e) => setCode(e.target.value)} />
    </div>
    <div className="form-group">
      <label htmlFor="name">Name:</label>
      <input type="text" id="name" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
    </div>
    <div className="form-group">
      <label htmlFor="quantity">Quantity:</label>
      <input type="number" id="quantity" className="form-control" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
    </div>
    <div className="form-group">
      <label htmlFor="price">Price:</label>
      <input type="number" step="0.01" id="price" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} />
    </div>
    <button type="submit" className="btn btn-primary">Add Item</button>
  </form>
  );
};

export default StationeryForm;
