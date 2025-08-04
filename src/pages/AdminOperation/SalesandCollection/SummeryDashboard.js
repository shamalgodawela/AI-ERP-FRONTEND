import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";
import MonthlySalesChart from '../../Companysales/Barchartsales/MonthlySalesChart';
import SalesByExePieChart from '../../Companysales/piechartsales/SalesByExePieChart';
import Tabelexesales from '../../Companysales/tabelsales/Tabelexesales';
import Footer from '../../../compenents/footer/Footer';

const SummeryDashboard = () => {
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
    <div>
      <Link to="#" onClick={goBack}><IoMdArrowRoundBack size={23} /></Link>&nbsp;&nbsp;
      <div className='sales-Heading'>
        <h3>Hi, Welcome back!</h3>
        <h4>Finance Performance and Monitoring Sales Performance</h4>
        <h4 className='h4-season-update-heading'>Updated details of 2024 April to present (Yala season)</h4>
      </div>
      <div className="cards-container">
        <div className="card">
          <div className="card-header">
            <h2>Total Sales</h2>
          </div>
          <div className="card-body">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <p>RS/= {formatNumbers(totalSales)}</p>
            )}
          </div>
        </div>
        <Link to="/Collectioh-dashboard">
          <div className="card">
            <div className="card-header">
              <h2>Total Collection</h2>
            </div>
            <div className="card-body">
              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p>{error}</p>
              ) : (
                <p>RS/= {formatNumbers(totalcollection)}</p>
              )}
            </div>
          </div>
        </Link>

        <div className="card">
          <div className="card-header">
            <h2>Total Outstanding</h2>
          </div>
          <div className="card-body">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <p>RS/= {formatNumbers(outstanding)}</p>
            )}
          </div>
        </div>
      </div>
      <div className="chart-container">
        <h2>Monthly Sales</h2>
        <MonthlySalesChart />
      </div>
      <div>
        <h2 className="pie-container">Executive wise Sales (2024 April to present)</h2>
        <SalesByExePieChart />
      </div>
      <div>
        <h2 className="pie-container">Executive Monthly Sales</h2>
        <Tabelexesales />
      </div>

      <Footer />
    </div>
  );
};

export default SummeryDashboard;
