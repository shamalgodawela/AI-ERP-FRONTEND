import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './collection.css'

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MonthlyCollection = () => {
  const [monthlySales, setMonthlySales] = useState([]);
  const [monthlyCollection, setMonthlyCollection] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMonthlySales = async () => {
      try {
        const response = await axios.get('https://nihon-inventory.onrender.com/api/monthlysales');
        setMonthlySales(response.data);
      } catch (error) {
        console.error('Failed to fetch monthly sales', error);
        setError('Failed to fetch monthly sales');
      } finally {
        setLoading(false);
      }
    };

    const fetchMonthlyCollection = async () => {
      try {
        const response = await axios.get('https://nihon-inventory.onrender.com/api/monthly-collection');
        setMonthlyCollection(response.data);
      } catch (error) {
        console.error('Failed to fetch monthly collection', error);
        setError('Failed to fetch monthly collection');
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlySales();
    fetchMonthlyCollection();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Combine sales and collection data
  const combinedData = monthlySales.map(sale => {
    const collection = monthlyCollection.find(col => {
      console.log(`Matching sale ${sale.year}-${sale.month} with collection ${col.year}-${col.month}`);
      return col.year === sale.year && col.month === sale.month;
    });
    if (!collection) {
      console.warn(`No collection found for ${sale.year}-${sale.month}`);
    }
    return {
      year: sale.year,
      month: sale.month,
      totalSales: sale.totalSales,
      totalCollection: collection ? collection.totalOutstanding : 0
    };
  });
  

  const data = {
    labels: combinedData.map(item => `${item.year}-${String(item.month).padStart(2, '0')}`),
    datasets: [
      {
        label: 'Total Sales (RS/=)',
        data: combinedData.map(item => item.totalSales),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      },
      {
        label: 'Total Collection (RS/=)',
        data: combinedData.map(item => item.totalCollection),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
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
            return `RS/= ${value.toLocaleString()}`;
          }
        }
      }
    }
  };

  return (
    <div>
      <h1 className='h1-collection'>Sales and Collection Compairism According to Months</h1>
    <div className="chart-container">
      <Bar data={data} options={options} />
    </div>
    </div>
  );
};

export default MonthlyCollection;
