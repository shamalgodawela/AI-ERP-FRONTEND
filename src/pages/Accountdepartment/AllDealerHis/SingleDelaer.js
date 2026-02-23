import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Footer from '../../../compenents/footer/Footer';
import { IoMdArrowRoundBack } from 'react-icons/io';

const SingleDelaer = () => {
  const [productMovement, setProductMovement] = useState({});
  const [totalInvoiceAmount, setTotalInvoiceAmount] = useState(0);
  const [totalCollectionAmount, setTotalCollectionAmount] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [dealerCode, setDealerCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const location = useLocation();
  const { state } = location;

  useEffect(() => {
    if (state && state.code) {
      setDealerCode(state.code);
    }
  }, [state]);

  const printPage = () => {
    window.print();
  };

  const fetchData = useCallback(async () => {
    if (!dealerCode.trim()) {
      setError('Please enter a dealer code');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await axios.get(
        `https://nihon-inventory.onrender.com/api/get-total-salesby-dealer/${dealerCode}`,
        { params }
      );

      const {
        productMovement,
        totalInvoiceAmount,
        totalCollectionAmount,
        customerName,
      } = response.data;

      setProductMovement(productMovement);
      setTotalInvoiceAmount(totalInvoiceAmount);
      setTotalCollectionAmount(totalCollectionAmount);
      setCustomerName(customerName);
    } catch (error) {
      setError('Data Not found');
    } finally {
      setLoading(false);
    }
  }, [dealerCode, startDate, endDate]);

  useEffect(() => {
    if (dealerCode.trim()) {
      fetchData();
    }
  }, [dealerCode, fetchData]);

  const chartData = {
    labels: Object.keys(productMovement),
    datasets: [
      {
        label: 'Product Movement (Quantity)',
        data: Object.values(productMovement),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const formatNumbers = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const goback = () => {
    navigate(-1);
  };

  return (
    <div className="dealer-history-bg">

      {/* PRINT BUTTON */}
      <button onClick={printPage} className="print-btn no-print">
        Print Report
      </button>

      <div className="dealer-history-card" id="print-section">

        <Link to="#" onClick={goback} className="Back-Icon no-print">
          <IoMdArrowRoundBack size={23} />
        </Link>

        <h2 className="h2-dealer-history">Dealer History Information</h2>

        {/* SHOW DATE RANGE */}
        <div className="date-range-display">
          {startDate && endDate ? (
            <>
              <p><strong>From:</strong> {startDate}</p>
              <p><strong>To:</strong> {endDate}</p>
            </>
          ) : (
            <p>No date range selected</p>
          )}
        </div>

        {/* SEARCH BOX */}
        <div className="dealer-history-search no-print">
          <input
            type="text"
            placeholder="Enter Dealer Code"
            value={dealerCode}
            onChange={(e) => setDealerCode(e.target.value)}
          />

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <span>to</span>

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          <button
            onClick={fetchData}
            disabled={!dealerCode.trim() || !startDate || !endDate}
          >
            Search
          </button>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {!loading && !error && (
          <div>
            <p className="dealer-history-p">
              Total Invoice Amount: Rs/= {formatNumbers(totalInvoiceAmount)}
            </p>

            <p className="dealer-history-p">
              Total Collection Amount: Rs/= {formatNumbers(totalCollectionAmount)}
            </p>

            <p className="dealer-history-p">
              Total Outstanding Amount: Rs/= {formatNumbers(
                totalInvoiceAmount - totalCollectionAmount
              )}
            </p>

            <p className="dealer-history-p">
              Customer Name: {customerName || 'N/A'}
            </p>

            <h3 className="h2-dealer-history">Product Movement</h3>

            {Object.keys(productMovement).length === 0 ? (
              <p>No product movement data available</p>
            ) : (
              <Bar
                data={chartData}
                className="no-print"
                options={{
                  responsive: true,
                  scales: { y: { beginAtZero: true } },
                }}
              />
            )}

            <h3 className="h2-dealer-history" style={{ marginTop: 30 }}>
              Product Movement Table
            </h3>

            {Object.keys(productMovement).length === 0 ? (
              <p>No product movement data available</p>
            ) : (
              <table className="dealer-history-table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(productMovement).map(
                    ([product, quantity], index) => (
                      <tr key={index}>
                        <td>{product}</td>
                        <td>{quantity}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      <button
        className="home-btn no-print"
        onClick={() => navigate('/admin-profile')}
      >
        Home
      </button>

      <Footer className="no-print" />
    </div>
  );
};

export default SingleDelaer;
