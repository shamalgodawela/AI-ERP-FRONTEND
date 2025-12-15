import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const monthNames = [
  'Apr','May','Jun','Jul','Aug','Sep',
  'Oct','Nov','Dec','Jan','Feb','Mar'
];

const MonthlySalesChart = () => {
  const [groupedData, setGroupedData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMonthlySales();
  }, []);

  const fetchMonthlySales = async () => {
    try {
      const res = await axios.get(
        'https://nihon-inventory.onrender.com/api/monthlysales'
      );
      groupByFinancialYear(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // 🔹 Group data by Financial Year (Apr–Mar)
  const groupByFinancialYear = (data) => {
    const result = {};

    data.forEach(({ year, month, totalSales }) => {
      const fyStart = month >= 4 ? year : year - 1;
      const fyEnd = fyStart + 1;
      const fyKey = `FY ${fyStart}-${String(fyEnd).slice(2)}`;

      if (!result[fyKey]) {
        result[fyKey] = Array(12).fill(0);
      }

      const index = month >= 4 ? month - 4 : month + 8;
      result[fyKey][index] = totalSales;
    });

    setGroupedData(result);
  };

  const chartOptions = (title) => ({
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: title,
        font: { size: 16 }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: value => `Rs ${value.toLocaleString()}`
        }
      }
    }
  });

  if (loading) return <p>Loading charts...</p>;

  return (
    <div style={{ display: 'grid', gap: '40px' }}>
      {Object.keys(groupedData).map((fy) => (
        <div key={fy} style={{ background: '#fff', padding: 20, borderRadius: 10 }}>
          <Bar
            data={{
              labels: monthNames,
              datasets: [
                {
                  label: 'Sales',
                  data: groupedData[fy],
                  backgroundColor: '#4f46e5'
                }
              ]
            }}
            options={chartOptions(fy)}
          />
        </div>
      ))}
    </div>
  );
};

export default MonthlySalesChart;
