import React, { useEffect, useState } from 'react';
import axios from 'axios';


const Tabelexesales = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalesByExe = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/monthlysalesbyexe');
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
  return (
    <div className="sales-by-exe-container">
      <h2>Sales by Executive</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
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
      )}
    </div>
  );
};

export default Tabelexesales;
