import React, { useState } from 'react';
import axios from 'axios';
import './SalesByExe.css'; // Import the CSS file
import NavBar from '../../../compenents/sidebar/NavBar';

const SalesByExe = () => {
  const [exe, setExe] = useState('');
  const [salesData, setSalesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!exe) {
      alert('Please select a sales executive');
      return;
    }
    setIsLoading(true);
    try {
              const response = await axios.get(`http://localhost:5000/api/get-executives-sales-eachProduct/${exe}`);
      setSalesData(response.data);
    } catch (error) {
      console.error('Error fetching sales data:', error.message);
      alert('Failed to fetch sales data');
    } finally {
      setIsLoading(false);
    }
  };
  const formatNumbers = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

  return (
    <div>
        <NavBar/>
    <div className="sales-container">
      <h2 className="sales-title">Product-Wise Sales by Executive</h2>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
        <select
          className="sales-select"
          name="exe"
          value={exe}
          onChange={(e) => setExe(e.target.value)} // Update the exe state on change
        >
          <option value="">Select EXE:</option>
          <option value="Mr.Ahamed">Mr.Ahamed</option>
          <option value="Mr.Dasun">Mr.Dasun</option>
          <option value="Mr.Chameera">Mr.Chameera</option>
          <option value="Mr.Sanjeewa">Mr.Sanjeewa</option>
          <option value="Mr.Navaneedan">Mr.Navaneedan</option>
          <option value="Mr.Nayum">Mr.Nayum</option>
        </select>
        <button
          className="sales-button"
          onClick={handleSearch}
        >
          Get Sales Data
        </button>
      </div>

      {isLoading ? (
        <p className="sales-loader">Loading...</p>
      ) : (
        salesData.length > 0 && (
          <table className="sales-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Total Sales</th>
                <th>Total Quantity</th>
              </tr>
            </thead>
            <tbody>
              {salesData.map((data, index) => (
                <tr key={index}>
                  <td>{data.productName}</td>
                  <td>{formatNumbers(data.totalSales.toFixed(2))}</td>
                  <td>{data.totalQuantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </div>
    </div>
  );
};

export default SalesByExe;
