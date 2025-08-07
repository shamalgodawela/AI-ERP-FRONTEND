import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminViewincentive = () => {
    const navigate = useNavigate();
  const [incentives, setIncentives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('https://nihon-inventory.onrender.com/api/get-incentive')
      .then(response => {
        setIncentives(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load incentive data.');
        setLoading(false);
      });
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date)) return dateStr; 
    return date.toISOString().split('T')[0]; 
  };
  

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
    <div className="incentive-container">
      <h2>Executive Incentive Report</h2>
      <table className="incentive-table">
        <thead>
          <tr>
            <th>Invoice Number</th>
            <th>Customer</th>
            <th>Executive</th>
            <th>Payment Mode</th>
            <th>Invoice Total (Rs)</th>
            <th>Incentive Amount (Rs)</th>
            <th>Invoice setlled date</th>
            <th>Invoice due date</th>
          </tr>
        </thead>
        <tbody>
          {incentives.map((item, index) => (
            <tr key={index}>
              <td>{item.invoiceNumber}</td>
              <td>{item.customer}</td>
              <td>{item.exe}</td>
              <td>{item.ModeofPayment}</td>
              <td>{item.invoiceTotal}</td>
              <td>{item.incentiveAmount}</td>
              <td>{item.IncentiveDueDate}</td>
              <td>{formatDate(item.Duedate)}</td>

            </tr>
          ))}
        </tbody>
      </table>
      
    </div>
    <button className="home-btn" onClick={() => navigate('/admin-profile')}>Home</button>
    </div>
  );
};

export default AdminViewincentive;
