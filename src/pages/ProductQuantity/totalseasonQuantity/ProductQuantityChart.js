// src/components/ProductQuantityChart.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import './quantity.css'
import Footer from '../../../compenents/footer/Footer';
import NavBar from '../../../compenents/sidebar/NavBar';

const ProductQuantityChart = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/totalproduct');
        setData(response.data);
      } catch (err) {
        console.error('Failed to fetch data', err);
        setError('Failed to fetch data');
      }
    };

    fetchData();
  }, []);

  const chartData = {
    labels: data.map(item => item.productCode),
    datasets: [
      {
        label: 'Total Quantity',
        data: data.map(item => item.totalQuantity),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
        <NavBar/>
      <h2 className='h2-product-quantity'>Product Quantity Bar Chart(April to present(Yala season))</h2>
      {error ? (
        <p>{error}</p>
      ) : (
        <Bar data={chartData} options={options} />
      )}
      <Footer/>
    </div>
  );
};

export default ProductQuantityChart;
