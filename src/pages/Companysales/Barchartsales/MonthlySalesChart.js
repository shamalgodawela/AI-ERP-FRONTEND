// src/components/MonthlySalesChart.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MonthlySalesChart = () => {
  const [monthlySales, setMonthlySales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMonthlySales = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/monthlysales');
        setMonthlySales(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch monthly sales', error);
        setError('Failed to fetch monthly sales');
        setLoading(false);
      }
    };

    fetchMonthlySales();
  }, []);

  const formatNumbers = (number) => {
    return number.toLocaleString();
  };

  const data = {
    labels: monthlySales.map(sale => `${sale.year}-${String(sale.month).padStart(2, '0')}`),
    datasets: [
      {
        label: 'Total Sales (RS/=)',
        data: monthlySales.map(sale => sale.totalSales),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return `RS/= ${formatNumbers(value)}`;
          }
        }
      }
    }
  };

  return (
    <div className="chart-container">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <Bar data={data} options={options} />
      )}
    </div>
  );
};

export default MonthlySalesChart;
