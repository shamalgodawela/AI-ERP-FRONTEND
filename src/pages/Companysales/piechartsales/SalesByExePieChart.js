import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';

const SalesByExePieChart = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Fetch data whenever startDate or endDate changes
  useEffect(() => {
    const fetchData = async () => {
      if (!startDate || !endDate) {
        setError("Please select both start and end dates");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get('https://nihon-inventory.onrender.com/api/salesbyExe', {
          params: {
            startDate,
            endDate
          }
        });

        setSalesData(response.data);
      } catch (error) {
        console.error('Error fetching sales by executive:', error);
        setError('Failed to fetch sales data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate]); // Dependency array ensures that it runs whenever these values change

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>

      <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{
            marginBottom: '10px',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '16px',
            width: '200px'
          }}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={{
            marginBottom: '10px',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '16px',
            width: '200px'
          }}
        />
        <button
          onClick={() => {}}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Search
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : salesData.length === 0 ? (
        <p>No data found for the selected period</p>
      ) : (
        <div style={{ width: '600px', height: '600px' }}>
          <Pie
            data={{
              labels: salesData.map(item => item._id),
              datasets: [
                {
                  data: salesData.map(item => item.totalSales),
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.8)', // Red
                    'rgba(54, 162, 235, 0.8)', // Blue
                    'rgba(255, 206, 86, 0.8)', // Yellow
                    'rgba(0, 255, 0, 1)', // Green
                    'rgba(153, 102, 255, 0.8)', // Purple
                    'rgba(255, 159, 64, 0.8)', // Orange
                    'rgba(255, 192, 203, 1)' // Pink
                  ]
                }
              ]
            }}
            options={{
              plugins: {
                legend: {
                  display: true,
                  position: 'bottom'
                }
              }
            }}
          />
        </div>
      )}

      {/* Display sales data below the chart */}
      {salesData.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Sales Data by Executive</h3>
          <ul style={{ listStyleType: 'none', padding: '0' }}>
            {salesData.map((item, index) => (
              <li key={index} style={{ marginBottom: '10px' }}>
                <strong>{item._id}:</strong> {item.totalSales} units
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SalesByExePieChart;
