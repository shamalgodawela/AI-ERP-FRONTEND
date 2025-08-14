import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const ViewAllincentive = () => {
  const navigate = useNavigate();
  const [incentives, setIncentives] = useState([]);
  const [filteredIncentives, setFilteredIncentives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter states
  const [selectedExe, setSelectedExe] = useState('All');
  const [searchMonth, setSearchMonth] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedSettlement, setSelectedSettlement] = useState('All');

  useEffect(() => {
    axios.get('https://nihon-inventory.onrender.com/api/get-incentive')
      .then(response => {
        setIncentives(response.data);
        setFilteredIncentives(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load incentive data.');
        setLoading(false);
      });
  }, []);

  const uniqueExecutives = ['All', ...Array.from(new Set(incentives.map(item => item.exe)))];
  const uniqueStatuses = ['All', ...Array.from(new Set(incentives.map(item => item.IncentiveStatus)))];
  const uniqueSettlements = ['All', ...Array.from(new Set(incentives.map(item => item.Incentivesettlement)))];

  const formatNumberWithCommas = (num) => {
    return num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const applyFilters = (exe, month,IncentiveStatus,Incentivesettlement) => {
    let filtered = incentives;

    if (exe !== 'All') {
      filtered = filtered.filter(item => item.exe === exe);
    }

    if (month) {
      filtered = filtered.filter(item =>
        item.IncentiveDueDate &&
        item.IncentiveDueDate.startsWith(month)
      );
    }

    if (IncentiveStatus !== 'All') {
      filtered = filtered.filter(item => item.IncentiveStatus === IncentiveStatus);
    }

    if (Incentivesettlement !== 'All') {
      filtered = filtered.filter(item => item.Incentivesettlement === Incentivesettlement);
    }

    setFilteredIncentives(filtered);
  };

  // Handlers for each filter change
  const handleSelectChange = (e) => {
    const exe = e.target.value;
    setSelectedExe(exe);
    applyFilters(exe, searchMonth, selectedStatus, selectedSettlement);
  };

  const handleMonthChange = (e) => {
    const month = e.target.value;
    setSearchMonth(month);
    applyFilters(selectedExe, month, selectedStatus, selectedSettlement);
  };

  const handleStatusChange = (e) => {
    const status = e.target.value;
    setSelectedStatus(status);
    applyFilters(selectedExe, searchMonth, status, selectedSettlement);
  };

  const handleSettlementChange = (e) => {
    const settlement = e.target.value;
    setSelectedSettlement(settlement);
    applyFilters(selectedExe, searchMonth, selectedStatus, settlement);
  };

  const totalIncentiveAmount = filteredIncentives.reduce((sum, item) => {
    return sum + (parseFloat(item.incentiveAmount) || 0);
  }, 0);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printableArea, #printableArea * {
            visibility: visible;
          }
          #printableArea {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div>
        <div className="incentive-container">
          <h2>Executive Incentive Report</h2>

          {/* Filter Controls */}
          <div className="no-print" style={{ marginBottom: '10px' }}>
            <label htmlFor="exe-select" style={{ marginRight: '8px' }}>Filter by Executive:</label>
            <select
              id="exe-select"
              value={selectedExe}
              onChange={handleSelectChange}
              style={{ padding: '5px', width: '180px', marginRight: '10px' }}
            >
              {uniqueExecutives.map((exe, idx) => (
                <option key={idx} value={exe}>{exe}</option>
              ))}
            </select>

            <label htmlFor="month-filter" style={{ marginRight: '8px' }}>Filter by Month:</label>
            <input
              type="month"
              id="month-filter"
              value={searchMonth}
              onChange={handleMonthChange}
              style={{ padding: '5px', marginRight: '10px' }}
            />

            <label htmlFor="status-select" style={{ marginRight: '8px' }}>Filter by Incentive Status:</label>
            <select
              id="status-select"
              value={selectedStatus}
              onChange={handleStatusChange}
              style={{ padding: '5px', width: '180px', marginRight: '10px' }}
            >
              {uniqueStatuses.map((status, idx) => (
                <option key={idx} value={status}>{status}</option>
              ))}
            </select>

            <label htmlFor="settlement-select" style={{ marginRight: '8px' }}>Filter by Incentive Settlement:</label>
            <select
              id="settlement-select"
              value={selectedSettlement}
              onChange={handleSettlementChange}
              style={{ padding: '5px', width: '180px', marginRight: '10px' }}
            >
              {uniqueSettlements.map((settlement, idx) => (
                <option key={idx} value={settlement}>{settlement}</option>
              ))}
            </select>

            <button onClick={handlePrint} style={{ padding: '5px 10px' }}>
              Print Report
            </button>
          </div>

          {/* Printable Area */}
          <div id="printableArea">
            <p><strong>Total Incentive Amount : Rs {formatNumberWithCommas(totalIncentiveAmount)}</strong></p>

            <table
              className="incentive-table"
              border="1"
              cellPadding="5"
              cellSpacing="0"
              style={{ borderCollapse: 'collapse', width: '100%' }}
            >
              <thead>
                <tr>
                  <th>Invoice Number</th>
                  <th>Customer</th>
                  <th>Executive</th>
                  <th>Payment Mode</th>
                  <th>Invoice Total (Rs)</th>
                  <th>Incentive Amount (Rs)</th>
                  <th>Invoice Settled Date</th>
                  <th>Invoice Due Date</th>
                  <th>Incentive Status</th>
                  <th>Incentive Settlement</th>
                </tr>
              </thead>
              <tbody>
                {filteredIncentives.map((item, index) => (
                  <tr key={index}>
                    <td>{item.invoiceNumber}</td>
                    <td>{item.customer}</td>
                    <td>{item.exe}</td>
                    <td>{item.ModeofPayment}</td>
                    <td>{formatNumberWithCommas(parseFloat(item.invoiceTotal) || 0)}</td>
                    <td>{formatNumberWithCommas(parseFloat(item.incentiveAmount) || 0)}</td>
                    <td>{item.IncentiveDueDate}</td>
                    <td>{item.Duedate}</td>
                    <td>{item.IncentiveStatus}</td>
                    <td>{item.Incentivesettlement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <button
          className="home-btn no-print"
          onClick={() => navigate('/admin-profile')}
          style={{ marginTop: '15px' }}
        >
          Home
        </button>
      </div>
    </>
  );
};

export default ViewAllincentive;
