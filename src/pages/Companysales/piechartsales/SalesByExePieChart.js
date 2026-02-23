import React, { useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';

const SalesByExePieChart = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://nihon-inventory.onrender.com/api/salesbyExe', {
        params: { startDate, endDate }
      });
      setSalesData(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch sales data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }
    fetchData();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh' }}>
      <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        <button onClick={handleSearch}>Search</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : salesData.length === 0 ? (
        <p>No data found for the selected period</p>
      ) : (
        <>
          <div style={{ width: '600px', height: '600px' }}>
            <Pie
              data={{
                labels: salesData.map(item => item._id),
                datasets: [
                  {
                    data: salesData.map(item => item.totalSales),
                    backgroundColor: [
                      'rgba(255, 99, 132, 0.8)',
                      'rgba(54, 162, 235, 0.8)',
                      'rgba(255, 206, 86, 0.8)',
                      'rgba(0, 255, 0, 0.8)',
                      'rgba(153, 102, 255, 0.8)',
                      'rgba(255, 159, 64, 0.8)',
                      'rgba(255, 192, 203, 0.8)',
                    ]
                  }
                ]
              }}
              options={{
                plugins: {
                  legend: { display: true, position: 'bottom' }
                }
              }}
            />
          </div>

          <div style={{ marginTop: '20px' }}>
            <h3>Sales Data by Executive</h3>
            <ul>
              {salesData.map((item, idx) => (
                <li key={idx}>
                  <strong>{item._id}:</strong> {item.totalSales.toLocaleString('en-US', { style: 'currency', currency: 'LKR' })}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default SalesByExePieChart;
