import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Import useLocation
import Menu from '../../compenents/Menu/Menu';
import Footer from '../../compenents/footer/Footer';
import './Delaerh.css';
import { IoMdArrowRoundBack } from 'react-icons/io';

const DealerPastHistory = () => {
  const [productMovement, setProductMovement] = useState({});
  const [totalInvoiceAmount, setTotalInvoiceAmount] = useState(0);
  const [totalCollectionAmount, setTotalCollectionAmount] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [dealerCode, setDealerCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  const location = useLocation();
  const { state } = location;

 
  useEffect(() => {
    if (state && state.code) {
      setDealerCode(state.code);
    }
  }, [state]);

  // Fetch data from backend based on dealer code
  const fetchData = async () => {
    if (!dealerCode.trim()) {
      setError('Please enter a dealer code');
      return;
    }

    setLoading(true);
    setError(null);

    try {
              const response = await axios.get(`http://localhost:5000/api/get-total-salesby-dealer/${dealerCode}`);
      const { productMovement, totalInvoiceAmount, totalCollectionAmount, customerName } = response.data;
      console.log("Customer Name from API:", response.data.customerName);

      setProductMovement(productMovement);
      setTotalInvoiceAmount(totalInvoiceAmount);
      setTotalCollectionAmount(totalCollectionAmount);
      setCustomerName(customerName);

    } catch (error) {
      console.error('Error fetching dealer sales data:', error.message);
      setError('Failed to fetch dealer sales data');
    } finally {
      setLoading(false);
    }
  };

  // Automatically fetch data when dealerCode is auto-filled
  useEffect(() => {
    if (dealerCode.trim()) {
      fetchData();
    }
  }, [dealerCode]); // Fetch data whenever dealerCode changes

  // Data for Bar Chart
  const chartData = {
    labels: Object.keys(productMovement), // Product names
    datasets: [
      {
        label: 'Product Movement (Quantity)',
        data: Object.values(productMovement), // Quantities
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const formatNumbers = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const goback=()=>{
    navigate(-1);
  }

  return (
    <div>
      <Link to="#" onClick={goback} className="Back-Icon">
        <IoMdArrowRoundBack size={23} />
      </Link><br/><br/>
      <h2 className='h2-dealer-history'>Dealer History Information</h2>
      
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Enter Dealer Code"
          value={dealerCode}
          onChange={(e) => setDealerCode(e.target.value)}
          style={{ padding: '5px' }}
        />
        <button onClick={fetchData} disabled={!dealerCode.trim()} style={{ marginLeft: '10px' }}>
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <div>
          <p className='dealer-history-p'>Total Invoice Amount: Rs/= {formatNumbers(totalInvoiceAmount)}</p>
          <p className='dealer-history-p'>Total Collection Amount: Rs/= {formatNumbers(totalCollectionAmount)}</p>
          <p className='dealer-history-p'>Total Outstanding Amount: Rs/= {formatNumbers(totalInvoiceAmount - totalCollectionAmount)}</p>
          <p className='dealer-history-p'>Customer Name: {customerName || 'N/A'}</p>

          <h3 className='h2-dealer-history'>Product Movement</h3>
          {Object.keys(productMovement).length === 0 ? (
            <p>No product movement data available</p>
          ) : (
            <Bar
              data={chartData}
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          )}
        </div>
      )}
      <Footer />
    </div>
  );
};

export default DealerPastHistory;