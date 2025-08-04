import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';


const Tabelexesales = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalesByExe = async () => {
      try {
        const response = await axios.get('https://nihon-inventory.onrender.com/api/monthlysalesbyexe');
        setSalesData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch sales data by exe:', error);
        setError('Failed to fetch sales data by exe');
        setLoading(false);
      }
    };

    fetchSalesByExe();
  }, []);

  const formatNumbers = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // After fetching salesData
  const execs = [...new Set(salesData.map(item => item.exe))];
  const sumByYear = (year) =>
    execs.map(exe =>
      salesData
        .filter(item => item.year === year && item.exe === exe)
        .reduce((sum, item) => sum + item.totalSales, 0)
    );

  const barData2024 = {
    labels: execs,
    datasets: [
      {
        label: '2024 Sales',
        data: sumByYear(2024),
        backgroundColor: '#4f8cff',
      },
    ],
  };

  const barData2025 = {
    labels: execs,
    datasets: [
      {
        label: '2025 Sales',
        data: sumByYear(2025),
        backgroundColor: '#ff9f40',
      },
    ],
  };

  return (
    <div className="sales-by-exe-container">
      <h2>Sales by Executive</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          <table className="sales-by-exe-table">
            <thead>
              <tr>
                <th>Year</th>
                <th>Month</th>
                <th>Executive</th>
                <th>Total Sales</th>
              </tr>
            </thead>
            <tbody>
              {salesData.map((item, index) => (
                <tr key={index}>
                  <td>{item.year}</td>
                  <td>{item.month}</td>
                  <td>{item.exe}</td>
                  <td>RS:{formatNumbers(item.totalSales.toFixed(2))}/=</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="chart-container">
            <h2>2024 Executive Sales</h2>
            <Bar data={barData2024} />
          </div>
          <div className="chart-container">
            <h2>2025 Executive Sales</h2>
            <Bar data={barData2025} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Tabelexesales;
