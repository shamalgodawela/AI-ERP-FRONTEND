import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from '../../compenents/footer/Footer';
import './sales.css';
import MonthlySalesChart from './Barchartsales/MonthlySalesChart';
import SalesByExePieChart from './piechartsales/SalesByExePieChart';
import Tabelexesales from './tabelsales/Tabelexesales';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";

const Sales = () => {
  const [totalSales, setTotalSales] = useState(0);
  const [totalcollection, setTotalCollection] = useState(0);
  const [outstanding, setOutstanding] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTotalSales = async () => {
      try {
        const response = await axios.get('https://nihon-inventory.onrender.com/api/invoi/sum');
        setTotalSales(response.data.sum || 0); // Ensure default value
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch total sales', error);
        setError('Failed to fetch total sales');
        setLoading(false);
      }
    };

    const fetchTotalCollection = async () => {
      try {
        const response = await axios.get('https://nihon-inventory.onrender.com/api/sumofcollection');
        setTotalCollection(response.data.sum || 0); // Ensure default value
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch total collection', error);
        setError('Failed to fetch total collection');
        setLoading(false);
      }
    };

    fetchTotalSales();
    fetchTotalCollection();
  }, []);

  useEffect(() => {
    setOutstanding(totalSales - totalcollection);
  }, [totalSales, totalcollection]);

  const formatNumbers = (x) => {
    if (x === undefined || x === null) return "0";
    return x.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="sales-page">

  <div className="sales-header">
    <h1>Sales & Finance Dashboard</h1>
    <p>Monitor revenue, collections and executive performance</p>
  </div>

  <div className="nav-action">
    <Link to="/Collectioh-dashboard" className="primary-link">
      Go to Collection Dashboard
    </Link>
  </div>

  <section className="chart-section">
    <div className="chart-container">
      <div className="chart-header">
        <h2>Monthly Sales Overview</h2>
        <span className="chart-subtitle">
          Financial Year Wise Performance
        </span>
      </div>
      <MonthlySalesChart />
    </div>
  </section>

  <section className="chart-section">
    <h2 className="section-title">
      Executive Wise Sales (April 2024 – Present)
    </h2>
    <SalesByExePieChart />
  </section>

  <section className="chart-section">
    <h2 className="section-title">Executive Monthly Sales</h2>
    <Tabelexesales />
  </section>

  <button className="home-btn" onClick={() => navigate('/admin-profile')}>
    Home
  </button>

  <Footer />
</div>

  );
};

export default Sales;
